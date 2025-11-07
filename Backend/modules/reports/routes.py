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

@router.post("/bulk/")
def create_reports_bulk(reports: List[ReportCreate], db: Session = Depends(get_db)):
  if not reports:
    raise HTTPException(status_code=400, detail="Lista di report vuota")

  db_reports = [Report(**r.model_dump()) for r in reports]
  db.add_all(db_reports)
  db.commit()

  return {"inserted": len(db_reports)}
