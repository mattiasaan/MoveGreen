from pydantic import BaseModel

class TrakingCreate(BaseModel):
  user_id: int
  mode: str
  distance: int
  time_seconds: float
  co2_saved: float
  timestamp: str

class TrakingResponse(BaseModel):
  activity_id: int
  user_id: int
  mode: str
  distance: int
  time_seconds: float
  co2_saved: float
  timestamp: str

  class Config:
    from_attributes = True