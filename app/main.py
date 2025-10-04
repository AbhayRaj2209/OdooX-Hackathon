from fastapi import FastAPI
from .database import engine
from . import models

models.Base.metadata.create_all(bind=engine)

app=FastAPI()

@app.get("/")
def index():
    print("working succesfully")
    return {"msg": "working succesfully"}