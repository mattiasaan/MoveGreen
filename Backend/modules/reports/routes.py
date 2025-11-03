from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from .models import Report
from .schemas import ReportCreate, ReportResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
  return db.query(Report).all()

@router.post("/", response_model=ReportResponse)
def create_report(report: ReportCreate, db: Session= Depends(get_db)):
  new_report = Report(**report.model_dump())
  db.add(new_report)
  db.commit()
  db.refresh(new_report)
  return new_report