from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from .models import Traking
from .schemas import TrakingCreate, TrakingResponse
from modules.dashboard.models import Dashboard

router = APIRouter()

def calcola_punti(activity: TrakingCreate) -> int:
  return int(activity.distance * 0.1)

@router.post("/", response_model=TrakingResponse)
def create_activity(activity: TrakingCreate, db: Session = Depends(get_db)):
  new_activity = Traking(**activity.model_dump())
  db.add(new_activity)
  db.commit()
  db.refresh(new_activity)

  dashboard = db.query(Dashboard).filter(Dashboard.user_id == new_activity.user_id).first()

  punti = calcola_punti(activity)

  if not dashboard:
    dashboard = Dashboard(
      user_id=new_activity.user_id,
      total_distance_km=new_activity.distance,
      total_co2_saved=new_activity.co2_saved,
      total_points=punti
    )
    db.add(dashboard)
  else:
    dashboard.total_distance_km += new_activity.distance
    dashboard.total_co2_saved += new_activity.co2_saved
    dashboard.total_points += punti

  db.commit()
  db.refresh(dashboard)

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

@router.get("/user/activity/{user_id}", response_model=list[TrakingResponse])
def get_last_activities(user_id: int, db: Session = Depends(get_db)):
  last_activities = db.query(Traking).filter(Traking.user_id == user_id).order_by(Traking.activity_id.desc()).limit(3).all()
  return last_activities
