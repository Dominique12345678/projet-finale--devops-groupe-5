from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
from pathlib import Path

from contextlib import asynccontextmanager
from . import models, schemas, database, seed
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    try:
        # Check if any user exists, if not seed the database
        if not db.query(models.User).first():
            print("No users found. Seeding database...")
            seed.seed_db()
    finally:
        db.close()
    yield

app = FastAPI(title="E-commerce API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files for images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-commerce API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "backend"}

# --- PRODUCT ENDPOINTS ---

@app.get("/api/products", response_model=List[schemas.Product])
def get_products(
    page: int = 1, 
    limit: int = 10, 
    category: Optional[str] = None, 
    search: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
        
    offset = (page - 1) * limit
    products = query.order_by(models.Product.created_at.desc()).offset(offset).limit(limit).all()
    return products

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    if product.stock < 0:
        raise HTTPException(status_code=400, detail="Le stock doit être supérieur ou égal à zéro")
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product_update.dict().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # In a real app, we would hash the password here
    # For now, let's keep it simple or implement a quick hash later
    new_user = models.User(
        email=user.email,
        hashed_password=user.password, # Plain text for now, we'll fix this in the next step
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or db_user.hashed_password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return {
        "access_token": "fake-jwt-token", 
        "token_type": "bearer",
        "is_admin": db_user.is_admin,
        "user_id": db_user.id
    }

@app.post("/api/auth/google")
def google_auth(request: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    # Check if user already exists by google_id or email
    db_user = db.query(models.User).filter(
        (models.User.google_id == request.google_id) | (models.User.email == request.email)
    ).first()
    
    if not db_user:
        # Create new user
        db_user = models.User(
            email=request.email,
            full_name=request.full_name,
            google_id=request.google_id,
            hashed_password=None # Google users don't need a password initially
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    elif not db_user.google_id:
        # Link existing email account to Google ID
        db_user.google_id = request.google_id
        db_user.full_name = request.full_name # Update name if needed
        db.commit()
        db.refresh(db_user)
        
    return {
        "access_token": "fake-google-token", 
        "token_type": "bearer",
        "is_admin": db_user.is_admin,
        "user_id": db_user.id
    }

# --- ADMIN DASHBOARD ENDPOINTS ---

@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_sales = db.query(models.Invoice).filter(models.Invoice.status == "Paid").count()
    revenue = db.query(models.Invoice).filter(models.Invoice.status == "Paid").with_entities(func.sum(models.Invoice.total_amount)).scalar() or 0
    total_users = db.query(models.User).count()
    total_products = db.query(models.Product).count()
    
    # Mock data for chart
    sales_history = [
        {"name": "Jan", "sales": 400}, {"name": "Feb", "sales": 300}, 
        {"name": "Mar", "sales": 600}, {"name": "Apr", "sales": 800}
    ]
    
    return {
        "kpis": {
            "sales": total_sales,
            "revenue": revenue,
            "users": total_users,
            "products": total_products
        },
        "charts": {
            "sales_history": sales_history
        }
    }

# --- CATEGORY ENDPOINTS ---

@app.get("/api/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.post("/api/categories", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_cat = models.Category(**category.dict())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.put("/api/categories/{cat_id}", response_model=schemas.Category)
def update_category(cat_id: int, category_update: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db_cat.name = category_update.name
    db_cat.description = category_update.description
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.delete("/api/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    db_cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted"}

# --- INVOICE ENDPOINTS ---

@app.post("/api/invoices", response_model=schemas.Invoice)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = models.Invoice(
        user_id=invoice.user_id,
        total_amount=invoice.total_amount,
        status="Paid"
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@app.get("/api/admin/invoices", response_model=List[schemas.Invoice])
def get_admin_invoices(db: Session = Depends(get_db)):
    return db.query(models.Invoice).order_by(models.Invoice.created_at.desc()).all()

# --- USER MANAGEMENT ENDPOINTS ---

@app.get("/api/admin/users", response_model=List[schemas.User])
def get_admin_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.put("/api/admin/users/{user_id}/status")
def update_user_status(user_id: int, is_active: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.is_active = is_active
    db.commit()
    return {"message": f"User status updated to {is_active}"}

# --- PROFILE MANAGEMENT ENDPOINTS ---

@app.get("/api/users/{user_id}", response_model=schemas.User)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/api/users/{user_id}", response_model=schemas.User)
def update_user_profile(user_id: int, user_update: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.full_name = user_update.full_name
    db_user.email = user_update.email
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}")
def delete_user_account(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "Account deleted successfully"}

# --- PRODUCT CRUD (EXTENDED) ---

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_prod)
    db.commit()
    return {"message": "Product deleted"}

# --- UPLOAD ENDPOINT ---

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    file_extension = file.filename.split(".")[-1]
    file_name = f"{os.urandom(10).hex()}.{file_extension}"
    file_path = UPLOAD_DIR / file_name
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/uploads/{file_name}"}
