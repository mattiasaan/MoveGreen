from pydantic import BaseModel

class UserCreate(BaseModel):
  name: str
  email: str
  quartiere: str

class UserResponse(BaseModel):
  id: int
  name: str
  email: str
  quartiere: str

  class Config:
    from_attributes = True
