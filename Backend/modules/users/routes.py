from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from .models import User
from .schemas import UserCreate, UserResponse

router = APIRouter()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
  user = db.query(User).filter(User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=404, detail="non esiste")
  return user

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
  existing_user = db.query(User).filter(User.email == user.email).first()
  if existing_user:
    raise HTTPException(status_code=404, detail="l'email è già registrata usa un altra email")
  
  existing_user = db.query(User).filter(User.name == user.name).first()
  if existing_user:
    raise HTTPException(status_code=404, detail="nickname già in uso usa un altro nickname")
  
  new_user = User(**user.model_dump())
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  return new_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
  deleted_user = db.query(User).filter(User.id == user_id).first()
  if not deleted_user:
    raise HTTPException(status_code=404, detail="non esiste")
  db.delete(deleted_user)
  db.commit()
  message = "cancellato con successo"
  return message