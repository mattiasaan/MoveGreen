from pydantic import BaseModel

class DashboardResponse(BaseModel):
  total_distance_km: float
  total_co2_saved: float
  total_points: int
  class Config:
    from_attributes = True

class DashboardUpdate(BaseModel):
  total_distance_km: float | None = None
  total_co2_saved: float | None = None
  total_points: int | None = None