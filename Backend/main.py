from fastapi import FastAPI
from core.database import Base, engine
from modules.users import routes as user_routes
from modules.dashboard import routes as dashboard_routes
from modules.traking import routes as traking_routes
from modules.Leaderboard import routes as leaderboard_routes
from modules.reports import routes as report_routes

from core.database import engine

#python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
  return {"message": "root"}

app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(dashboard_routes.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(traking_routes.router, prefix="/traking", tags=["Traking"])
app.include_router(leaderboard_routes.router, prefix="/leaderboard", tags=["Leaderboard"])
app.include_router(report_routes.router, prefix="/report", tags=["report"])

print(f"Connected to database: {engine.url}")
