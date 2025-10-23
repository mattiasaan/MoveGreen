from fastapi import FastAPI
from core.database import Base, engine
from modules.users import routes as user_routes
#from Backend.modules.posts import routes as post_routes
#from Backend.modules.tracking import routes as tracking_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="My Backend")

@app.get("/")
def root():
  return {"message": "funziona"}

app.include_router(user_routes.router)
#app.include_router(post_routes.router)
#app.include_router(tracking_routes.router)
