from pydantic import BaseModel, EmailStr, Field
from datetime import date

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    class Config:
        from_attributes = True  
        
class ProjectCreate(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=255)  
    project_admin_id: int = Field(..., gt=0)  
    start_date: date  
    end_date: date | None = None

    class Config:
        from_attributes = True 


class AddMembers(BaseModel):
    project_id: int = Field(..., gt=0) 
    member_id: int = Field(..., gt=0)  

    class Config:
        from_attributes = True 


class AddExpenses(BaseModel):
    project_id: int = Field(..., gt=0)
    member_id: int = Field(..., gt=0)
    expense_name: str = Field(..., min_length=1, max_length=255)
    amount: int = Field(..., gt=0)
    expense_date: date | None = None

    class Config:
        from_attributes = True 