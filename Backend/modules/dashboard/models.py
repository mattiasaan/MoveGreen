from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base

class Dashboard(Base):
  __tablename__ = "dashboards"
  
  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), unique=True)
  total_distance_km = Column(Float, default=0.0)
  total_co2_saved = Column(Float, default=0.0)
  total_points = Column(Integer, default=0)
  
  user = relationship("User", back_populates="dashboard")