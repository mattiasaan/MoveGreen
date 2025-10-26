from fastapi import FastAPI
from core.database import Base, engine
from modules.users import routes as user_routes
from modules.dashboard import routes as dashboard_routes

#python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
  return {"message": "root"}

app.include_router(user_routes.router)
app.include_router(dashboard_routes.router, prefix="/dashboard", tags=["Dashboard"])
