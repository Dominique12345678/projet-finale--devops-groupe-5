from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models

def seed_db():
    # Drop and recreate tables to apply schema changes
    print("Recreating tables...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if admin already exists
    if db.query(models.User).filter(models.User.email == "admin@techshop.com").first():
        print("Admin already exists.")
    else:
        # Create Admin User
        admin_user = models.User(
            email="admin@techshop.com",
            hashed_password="adminpassword", 
            full_name="Admin Principal",
            is_admin=1,
            is_active=1
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created.")

    # Check if products already exist
    if db.query(models.Product).first():
        print("Products already exist.")
    else:
        products = [
            models.Product(
                name="Laptop Pro 16",
                description="High performance laptop for developers.",
                price=1999.99,
                stock=10,
                category="Electronics",
                image_url="https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
            ),
            models.Product(
                name="Wireless Mouse",
                description="Ergonomic wireless mouse.",
                price=49.99,
                stock=50,
                category="Accessories",
                image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"
            ),
            models.Product(
                name="Mechanical Keyboard",
                description="RGB mechanical keyboard with blue switches.",
                price=129.99,
                stock=20,
                category="Accessories",
                image_url="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae"
            )
        ]
        db.add_all(products)
        db.commit()
        print("Database successfully seeded with 3 products.")
    db.close()

if __name__ == "__main__":
    seed_db()
