from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional, Dict
import uuid

# Pydantic schema for creating a new expense
class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="The expense amount.")
    currency: str = Field(..., max_length=10, description="Currency of the expense (e.g., USD, EUR).")
    category: str = Field(..., max_length=100, description="Category of the expense.")
    description: Optional[str] = Field(None, description="A brief description of the expense.")
    expense_date: date = Field(..., description="The date the expense was incurred.")

# Pydantic schema for representing an expense in API responses
class ExpenseOut(BaseModel):
    id: int
    user_id: uuid.UUID
    amount: float
    currency: str
    category: str
    description: Optional[str]
    expense_date: date
    status: str

    class Config:
        from_attributes = True

# Pydantic schema for the result of an OCR scan
class OCRScanResult(BaseModel):
    amount: Optional[float]
    currency: Optional[str]
    expense_date: Optional[date]
    description: Optional[str]
    category: Optional[str]
    vendor: Optional[str]

# Pydantic schema for currency exchange rates
class ExchangeRate(BaseModel):
    base: str
    rates: Dict[str, float]
