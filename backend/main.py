# backend/main.py
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# 1. Initialize App
app = FastAPI(title="CoreInventory API")

# 2. Database Setup (Using SQLite for quick starting, easily swaps to PostgreSQL later)
DATABASE_URL = "sqlite:///./inventory.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 3. Core Database Models
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sku = Column(String, unique=True, index=True)
    category = Column(String)
    unit = Column(String) # e.g., kg, pieces

class StockMove(Base):
    __tablename__ = "stock_moves"
    # THIS IS YOUR LEDGER. Every receipt, delivery, and adjustment goes here.
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    move_type = Column(String) # "Receipt", "Delivery", "Internal", "Adjustment"
    quantity = Column(Integer) # Positive for incoming, Negative for outgoing
    source_location = Column(String) 
    destination_location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Create the tables in the database
Base.metadata.create_all(bind=engine)

# 4. Basic API Endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the CoreInventory API"}

# Run this using: uvicorn main:app --reload