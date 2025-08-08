from sqlalchemy import Column, Integer, ForeignKey, Date, String, Float, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Tabela Destynacje
class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String, nullable=False)
    voivodeship = Column(String, nullable=True)
    city = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    edited_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacja 1:n  Destination -> Wasterecord
    waste_records = relationship("WasteRecord", back_populates="destination")
    
    @property
    def return_destination(self):
        return f"{self.country}, {self.city}, {self.address}"