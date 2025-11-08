from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Traking(Base):
  __tablename__ = "traking"

  activity_id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  mode = Column(String, nullable=False)
  distance = Column(Float, nullable=False)
  time_seconds = Column(Float, nullable=False)
  co2_saved = Column(Float, nullable=False)
  timestamp = Column(String, nullable=False)

  user = relationship("User", back_populates="trakings")
  