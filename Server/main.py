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
    "https://expensetracker2-9iq8.onrender.com",  # Frontend URL
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
        project_admin_name=project.project_admin_name,  # Save the admin name
        start_date=project.start_date,
        end_date=project.end_date,
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

    return project_members

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

    # Fetch member and project details for additional fields
    user = db.query(User).filter(User.id == members.member_id).first()
    project = db.query(Projects).filter(Projects.id == members.project_id).first()
    if not user or not project:
        raise HTTPException(status_code=404, detail="User or Project not found")

    # Add the member to the project
    db_members = Members(
        project_id=members.project_id,
        member_id=members.member_id,
        member_name=user.name,  # New field
        project_name=project.project_name,  # New field
        member_role=members.member_role  # New field
    )
    db.add(db_members)
    db.commit()
    db.refresh(db_members)
    return db_members

# Expenses Creation
@app.post("/expenses/")
def create_expenses(expenses: AddExpenses, db: Session = Depends(get_db)):
    # Fetch related project and member info
    project = db.query(Projects).filter(Projects.id == expenses.project_id).first()
    member = db.query(User).filter(User.id == expenses.member_id).first()
    
    if not project or not member:
        raise HTTPException(status_code=404, detail="Project or Member not found")
    
    db_expenses = Expenses(
        project_id=expenses.project_id,
        member_id=expenses.member_id,
        expense_name=expenses.expense_name,
        amount=expenses.amount,
        expense_date=expenses.expense_date,
        project_name=project.project_name,  # New field
        member_name=member.name,  # New field
        expense_type=expenses.expense_type,  # New field
        expense_detail=expenses.expense_detail,  # Optional
        expense_proof=expenses.expense_proof,  # Optional
        expense_status=expenses.expense_status  # New field
    )
    db.add(db_expenses)
    db.commit()
    db.refresh(db_expenses)
    return db_expenses

# Fetch All Expenses
@app.get("/expenses/")
def read_all_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Expenses).offset(skip).limit(limit).all()


# Delete all users
@app.delete("/users/")
def delete_all_users(db: Session = Depends(get_db)):
    db.query(User).delete()
    db.commit()
    return {"message": "All users have been deleted"}

# Delete a user by ID
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": f"User with ID {user_id} has been deleted"}

# Delete a project by ID
@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Projects).filter(Projects.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Delete all expenses related to this project
    db.query(Expenses).filter(Expenses.project_id == project_id).delete()

    # Delete all members related to this project
    db.query(Members).filter(Members.project_id == project_id).delete()

    # Delete the project
    db.delete(project)
    db.commit()
    return {"message": f"Project with ID {project_id} and associated members/expenses have been deleted"}

# Delete a member from a project
@app.delete("/members/{member_id}/project/{project_id}")
def delete_member_from_project(member_id: int, project_id: int, db: Session = Depends(get_db)):
    member = db.query(Members).filter(
        Members.member_id == member_id,
        Members.project_id == project_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found in the specified project")

    # Delete the member from the project
    db.delete(member)
    db.commit()
    return {"message": f"Member with ID {member_id} has been removed from project {project_id}"}

# Delete an expense by ID
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    # Find the expense by ID
    expense = db.query(Expenses).filter(Expenses.id == expense_id).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Delete the expense
    db.delete(expense)
    db.commit()
    return {"message": f"Expense with ID {expense_id} has been deleted"}
