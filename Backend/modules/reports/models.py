from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from core.database import Base

class Report(Base):
  __tablename__ = "reports"

  user_id = Column(Integer, nullable=False)
  id = Column(Integer, primary_key=True, index=True)
  title = Column(String, nullable=False)
  description = Column(String, nullable=False)
  category = Column(String, nullable=False)
  types = Column(String, nullable=False)
  lat = Column(Float, nullable=False)
  lon = Column(Float, nullable=False)