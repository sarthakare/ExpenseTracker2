# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from base import Base  # Import Base from the new base.py
import os

# Use environment variables for sensitive data
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://sarthak:5gf0nwdAqA4HpRozdBRgSo86FmeFruOV@dpg-cs9pgujqf0us739kgu00-a.oregon-postgres.render.com/expense_tracker_s39r")

# Create an engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=10,  # Adjust based on your expected load
    max_overflow=20,  # Allows extra connections during peak usage
)

# Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    try:
        # Create tables based on Base metadata (which should include User)
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully")
    except Exception as e:
        print(f"Error creating tables: {e}")
