from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# Get DATABASE_URL from environment variable (set in docker-compose)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/ecommerce")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
