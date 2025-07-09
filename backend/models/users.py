from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Tabela Użytkownicy
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), nullable=False)
    surname = Column(String(50), nullable=False)
    username = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(15), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    edited_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacja 1:n  Users -> Wasterecords
    waste_records = relationship("WasteRecord", back_populates="user")
