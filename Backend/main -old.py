from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy. ext. declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

app = FastAPI()

engine = create_engine("sqlite:///user.db", connect_args={"check_same_thread":False})
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)
base = declarative_base()

class User(base):
  __tablename__="users"

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)
  email = Column(String, nullable=False, unique=True)

base.metadata.create_all(engine)

class UserCreate(BaseModel):
  name:str
  email:str

class UserResponse(BaseModel):
  id:int
  name:str
  email:str

  class Config:
    from_attributes = True

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()


@app.get("/")
def root():
  return {"message:""funziona"}


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id:int, db:Session = Depends(get_db)):
  user = db.query(User).filter(User.id == user_id).first() 
  if not user:
    raise HTTPException(status_code=404, detail="non esiste")
  return user
  

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db:Session = Depends(get_db)):
  if db.query(User).filter(User.email == user.email).first():
    raise HTTPException(status_code=404, detail="esiste già")
  
  new_user = User(**user.model_dump())
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  return new_user