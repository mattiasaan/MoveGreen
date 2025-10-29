from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from .models import Traking
from .schemas import TrakingCreate, TrakingResponse

router = APIRouter()

@router.post("/", response_model=TrakingResponse)
def create_activity(activity: TrakingCreate, db: Session = Depends(get_db)):
  new_activity = Traking(**activity.model_dump())
  db.add(new_activity)
  db.commit()
  db.refresh(new_activity)
  return new_activity

@router.get("/{activity_id}", response_model=TrakingResponse)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
  activity = db.query(Traking).filter(Traking.activity_id == activity_id).first()
  if not activity:
    raise HTTPException(status_code=404, detail="non esiste")
  return activity

@router.get("/user/{user_id}", response_model=list[TrakingResponse])
def get_activities_by_user(user_id: int, db: Session = Depends(get_db)):
  activities = db.query(Traking).filter(Traking.user_id == user_id).all()
  if not activities:
    raise HTTPException(status_code=404, detail=f"Nessuna attività per id {user_id}")
  return activities