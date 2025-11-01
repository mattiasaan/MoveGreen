from pydantic import BaseModel

class AppLeaderboard(BaseModel):
  name: str
  quartiere: str
  total_points: int

  class Config:
    orm_mode = True

