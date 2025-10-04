from .database import Base
from sqlalchemy import Column,Integer,String,Boolean, Enum, ForeignKey, UniqueConstraint, Date, Text, Numeric
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy.dialects.postgresql import UUID, JSONB

class Companies(Base):
    __tablename__="companies"
    id=Column(String, primary_key=True)
    name=Column(String, nullable=False)
    currency=Column(String, nullable=False, server_default="USD")
    country=Column(String, nullable=False)
    admin_user_id=Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at=Column(TIMESTAMP(timezone=True), server_default=text('now()')) 
    
class Users(Base):
    __tablename__="users"
    id=Column(UUID(as_uuid=True), primary_key=True)
    email=Column(String, nullable=False, unique=True)
    password=Column(String, nullable=False)
    role=Column(Enum("manager", "employee", name="user_role"), nullable=False, server_default="employee")
    otp_secret=Column(String,nullable=True)
    otp_expiry=Column(TIMESTAMP(timezone=True), nullable=True)
    created_at=Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    updated_at=Column(TIMESTAMP(timezone=True), nullable=True)
    
class UserRelationship(Base):
    __tablename__ = "user_relationships"
    id = Column(Integer, primary_key=True)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)   
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))    
    __table_args__ = (
        UniqueConstraint('manager_id', 'employee_id', name='user_relationships_manager_id_employee_id_key'),
    )
    
class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)    
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    expense_date = Column(Date, nullable=False)
    receipt_url = Column(String(500), nullable=True)   
    status = Column(String(50), nullable=False, server_default="pending")   
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))    

class Approval(Base):
    __tablename__ = "approvals"
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    approver_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), nullable=False, server_default="pending")
    comments = Column(Text, nullable=True)
    approved_at = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

class ApprovalRule(Base):
    __tablename__ = "approval_rules"   
    id = Column(Integer, primary_key=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    rule_name = Column(String(255), nullable=False)
    rule_type = Column(String(50), nullable=False)
    rule_config = Column(JSONB, nullable=False)   
    is_active = Column(Boolean, nullable=False, server_default='true')   
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
