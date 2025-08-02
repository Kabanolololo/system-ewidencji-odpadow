from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from datetime import datetime

# Tabela Kierowca
class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    edited_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacja 1:n  Kierowca -> Ewidencja
    waste_records = relationship("WasteRecord", back_populates="driver")
    
    @property
    def full_name(self):
        return f"{self.name} {self.surname}"