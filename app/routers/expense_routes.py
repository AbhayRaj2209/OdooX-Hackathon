from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Annotated
from sqlalchemy.orm import Session
import httpx
from datetime import date
import uuid
from ..database import get_db
from ..schemas import ExpenseCreate, ExpenseOut, ExchangeRate
from .. import models

# A mock user model to simulate a user
class User:
    def __init__(self, id: uuid.UUID, email: str, role: str):
        self.id = id
        self.email = email
        self.role = role

def get_current_user():
    
    return User(id=uuid.uuid4(), email="employee@example.com", role="employee")

# --- API Router Definition ---
router = APIRouter(
    prefix="/api",
    tags=["Expenses"]
)

# --- API Endpoints ---

@router.post("/expenses", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
async def submit_new_expense_claim(
    expense: ExpenseCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    To submit a new expense claim (with amount, currency, category, date, etc.).
    """
    try:
        print(f"User {current_user.email} is creating an expense: {expense.model_dump()}")
        new_expense = models.Expense(**expense.dump(), user_id=current_user.id)
        db.add(new_expense)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected Error: {e}")
    
    return {"msg": "expense submitted succesfully"}

@router.get("/expenses/my", response_model=List[ExpenseOut])
async def get_my_expense_history(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    To fetch the current user's expense history (Approved, Rejected, Pending).
    """
    print(f"Fetching expense history for user {current_user.email}")
    
    expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()
    
    # Returning mock data for demonstration
    return [
        ExpenseOut(id=1, user_id=current_user.id, amount=100.50, currency="USD", category="Travel", description="Flight ticket", expense_date=date(2025, 10, 4), status="approved"),
        ExpenseOut(id=2, user_id=current_user.id, amount=55.00, currency="USD", category="Food", description="Team lunch", expense_date=date(2025, 10, 3), status="pending"),
        ExpenseOut(id=3, user_id=current_user.id, amount=25.00, currency="EUR", category="Office Supplies", description="Stationery", expense_date=date(2025, 10, 2), status="rejected"),
    ]

@router.get("/currencies/exchange-rate/{base}", response_model=ExchangeRate)
async def get_live_exchange_rates(base: str):
    """
    To fetch live currency exchange rates (e.g., to convert EUR to USD for display).
    """
    api_url = f"https://api.exchangerate-api.com/v4/latest/{base.upper()}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(api_url)
            response.raise_for_status()  # Raises an exception for 4xx or 5xx status codes
            data = response.json()
            if "rates" not in data or "base" not in data:
                 raise HTTPException(status_code=500, detail="Invalid response from currency API.")
            return ExchangeRate(base=data["base"], rates=data["rates"])
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Error fetching exchange rates: {e.response.text}"
            )
        except httpx.RequestError:
            raise HTTPException(
                status_code=503,
                detail="Could not connect to the currency exchange service."
            )
