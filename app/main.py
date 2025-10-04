from fastapi import FastAPI
from .database import engine
from . import models
from .routers import expense_routes  

models.Base.metadata.create_all(bind=engine)

app=FastAPI()

app.include_router(expense_routes.router)