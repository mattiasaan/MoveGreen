from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from .models import Dashboard
from .schemas import DashboardResponse, DashboardUpdate

router = APIRouter()

@router.get("/{user_id}/dashboard", response_model=DashboardResponse)
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
  dashboard = db.query(Dashboard).filter(Dashboard.user_id == user_id).first()
  if not dashboard:
    raise HTTPException(status_code=404, detail="Dashboard not found")
  return dashboard

@router.put("/{user_id}/dashboard", response_model=DashboardResponse)
def update_dashboard(user_id: int, update: DashboardUpdate, db: Session = Depends(get_db)):
  dashboard = db.query(Dashboard).filter(Dashboard.user_id == user_id).first()
  if not dashboard:
    dashboard = Dashboard(user_id=user_id)
    db.add(dashboard)

  if update.total_distance_km is not None:
    dashboard.total_distance_km += update.total_distance_km

  if update.total_co2_saved is not None:
    dashboard.total_co2_saved += update.total_co2_saved
    
  if update.total_points is not None:
    dashboard.total_points += update.total_points

  db.commit()
  db.refresh(dashboard)
  return dashboard