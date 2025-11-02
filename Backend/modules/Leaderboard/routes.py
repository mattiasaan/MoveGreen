from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from modules.users.models import User
from modules.dashboard.models import Dashboard
from typing import List
from .schemas import AppLeaderboard

router = APIRouter()

@router.get("/", response_model=List[AppLeaderboard])
def get_leaderboard(
  db: Session = Depends(get_db),
  quartiere: str | None = Query(None, description="Filtra per quartiere")
):
  """
  in ordine decrescente per punti
  Include utenti senza dashboard punti = 0
  """
  query = db.query(
    User.name,
    User.quartiere,
    Dashboard.total_points
  ).outerjoin(Dashboard, User.id == Dashboard.user_id)

  if quartiere:
    query = query.filter(User.quartiere == quartiere)

  results = query.order_by(Dashboard.total_points.desc().nullslast()).all()

  leaderboard = [
    AppLeaderboard(
      name=r.name,
      quartiere=r.quartiere,
      total_points=r.total_points or 0
    )
    for r in results
  ]

  return leaderboard

@router.get("/position/{user_id}")
def get_user_position(user_id: int, db: Session = Depends(get_db)):
  results = (
    db.query(
      User.id,
      User.name,
      Dashboard.total_points
    )
    .outerjoin(Dashboard, User.id == Dashboard.user_id)
    .order_by(Dashboard.total_points.desc().nullslast())
    .all()
  )

  for index, row in enumerate(results, start=1):
    if row.id == user_id:
      return {
        "user_id": row.id,
        "name": row.name,
        "total_points": row.total_points or 0,
        "rank": index
      }

  raise HTTPException(status_code=404, detail="User not found")