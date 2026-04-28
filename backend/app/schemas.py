from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    category: str
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: int
    is_active: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- CATEGORY SCHEMAS ---
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- INVOICE SCHEMAS ---
class InvoiceCreate(BaseModel):
    user_id: int
    total_amount: float

class Invoice(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- AUTH SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    email: str
    full_name: str
    google_id: str
