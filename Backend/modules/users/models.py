from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)
  email = Column(String, nullable=False, unique=True)
  quartiere = Column(String, nullable=False)

  dashboard = relationship("Dashboard", back_populates="user", uselist=False)

  trakings = relationship("Traking",back_populates="user",cascade="all, delete-orphan")