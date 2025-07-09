from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Tabela odpady
class Waste(Base):
    __tablename__ = "wastes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(6), nullable=False)
    name = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    edited_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacja 1:n  Odpady -> Ewidencja
    waste_records = relationship("WasteRecord", back_populates="waste")
