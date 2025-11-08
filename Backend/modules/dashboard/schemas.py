from pydantic import BaseModel, field_serializer

class DashboardResponse(BaseModel):
  total_distance_km: float
  total_co2_saved: float
  total_points: int

  @field_serializer("total_distance_km", "total_co2_saved", mode="plain")
  def round_floats(self, v):
    return round(v, 3)

  class Config:
    from_attributes = True

class DashboardUpdate(BaseModel):
  total_distance_km: float | None = None
  total_co2_saved: float | None = None
  total_points: int | None = None