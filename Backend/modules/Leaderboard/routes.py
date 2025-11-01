from fastapi import APIRouter, Depends, Query
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
