import os
from datetime import datetime, timedelta

import bcrypt
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from database import SessionLocal, create_tables
from models import User, Projects, Members, Expenses
from schemas import UserCreate, ProjectCreate, AddMembers, AddExpenses

# FastAPI app
app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create database tables
create_tables()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Hash password helper
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# User registration
@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    db_user = User(name=user.name, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# User login
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not bcrypt.checkpw(form_data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Projects Creation
@app.post("/projects/")
def create_projects(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Projects(
        project_name=project.project_name, 
        project_admin_id=project.project_admin_id, 
        start_date=project.start_date, 
        end_date=project.end_date
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Get all users
@app.get("/users/")
def read_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()

# Get all projects
@app.get("/projects/")
def read_all_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Projects).offset(skip).limit(limit).all()


# Get user by email
@app.get("/users/email/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "email": user.email}

# Get members by project ID
@app.get("/projects/{project_id}/members")
def get_members_by_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Projects).filter(Projects.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Query to get all members of the project
    project_members = db.query(Members).filter(Members.project_id == project_id).all()

    if not project_members:
        raise HTTPException(status_code=404, detail="No members found for this project")

    # Return only the member IDs or you can return more details as required
    return [{"member_id": member.member_id} for member in project_members]

# Modify Members Creation - Check if member already exists in the project
@app.post("/members/")
def create_members(members: AddMembers, db: Session = Depends(get_db)):
    # Check if the member is already assigned to the project
    existing_member = db.query(Members).filter(
        Members.project_id == members.project_id,
        Members.member_id == members.member_id
    ).first()

    if existing_member:
        raise HTTPException(status_code=400, detail="Member is already assigned to this project.")

    # Add the member to the project if not already added
    db_members = Members(
        project_id=members.project_id, 
        member_id=members.member_id
    )
    db.add(db_members)
    db.commit()
    db.refresh(db_members)
    return db_members

# Get all projects assigned to a specific user
@app.get("/users/{user_id}/projects")
def get_projects_for_user(user_id: int, db: Session = Depends(get_db)):
    # Query the Members table to find all projects where the user is a member
    assigned_projects = db.query(Projects).join(Members, Projects.id == Members.project_id).filter(Members.member_id == user_id).all()
    
    if not assigned_projects:
        raise HTTPException(status_code=404, detail="No projects found for this user")
    
    return assigned_projects


# Expenses Creation
@app.post("/expenses/")
def create_expenses(expenses: AddExpenses, db: Session = Depends(get_db)):
    db_expenses = Expenses(
        project_id=expenses.project_id, 
        member_id=expenses.member_id,
        expense_name=expenses.expense_name,
        amount=expenses.amount, 
        expense_date=expenses.expense_date
    )
    db.add(db_expenses)
    db.commit()
    db.refresh(db_expenses)
    return db_expenses

