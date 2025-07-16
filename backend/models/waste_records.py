from sqlalchemy import Column, Integer, ForeignKey, Date, String, Float, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Tabela Ewidencja
class WasteRecord(Base):
    __tablename__ = "waste_records"

    id = Column(Integer, primary_key=True, index=True)
    contractor_id = Column(Integer, ForeignKey("contractors.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    waste_id = Column(Integer, ForeignKey("wastes.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    transfer_date = Column(Date, nullable=False) #YYYY-MM-DD
    mass_kg = Column(Float, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    edited_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacja 1:n pomiędzy użtkownik, kontrahent, odpad, samochód, kierowca -> ewidencja
    user = relationship("User", back_populates="waste_records")
    contractor = relationship("Contractor", back_populates="waste_records")
    waste = relationship("Waste", back_populates="waste_records")
    vehicle = relationship("Vehicle", back_populates="waste_records")
    driver = relationship("Driver", back_populates="waste_records")
    destination = relationship("Destination", back_populates="waste_records")