from pydantic import BaseModel, EmailStr, Field
from datetime import date

# User creation schema
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    class Config:
        from_attributes = True  


# Project creation schema with admin name
class ProjectCreate(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=255)
    project_admin_id: int = Field(..., gt=0)  
    admin_name: str = Field(..., min_length=1, max_length=255)  # New admin_name field
    start_date: date
    end_date: date | None = None

    class Config:
        from_attributes = True


# Add members schema with member details and role
class AddMembers(BaseModel):
    project_id: int = Field(..., gt=0)
    member_id: int = Field(..., gt=0)
    project_name: str = Field(..., min_length=1, max_length=255)  # New project_name field
    member_name: str = Field(..., min_length=1, max_length=255)   # New member_name field
    member_role: str = Field(..., min_length=1, max_length=50)    # New member_role field

    class Config:
        from_attributes = True


# Add expenses schema with additional expense details
class AddExpenses(BaseModel):
    project_id: int = Field(..., gt=0)
    member_id: int = Field(..., gt=0)
    expense_name: str = Field(..., min_length=1, max_length=255)
    amount: int = Field(..., gt=0)
    expense_date: date | None = None
    project_name: str = Field(..., min_length=1, max_length=255)  # New project_name field
    member_name: str = Field(..., min_length=1, max_length=255)   # New member_name field
    expense_type: str = Field(..., min_length=1, max_length=100)  # New expense_type field
    expense_detail: str | None = None                             # New optional expense_detail field
    expense_proof: str | None = None                              # New optional expense_proof field
    expense_status: str = Field(..., min_length=1, max_length=50) # New expense_status field

    class Config:
        from_attributes = True
