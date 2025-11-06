from pydantic import BaseModel

class ReportCreate(BaseModel):
  user_id: int
  title: str
  description: str
  category: str
  type: str
  lat: float
  lon: float


class ReportResponse(BaseModel):
  id:int
  title: str
  description: str
  category: str
  type: str
  lat: float
  lon: float

  class Config:
    from_attributes = True