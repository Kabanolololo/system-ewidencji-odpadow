from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

# Schematy podstawowy dla rekordu
class WasteRecordBase(BaseModel):
    contractor_id: int
    user_id: int
    waste_id: int
    vehicle_id: int
    driver_id: int
    destination_id: int
    transfer_date: date
    mass_kg: float
    price_per_kg: float
    total_price: float
    notes: Optional[str] = None

# schemat tworzenia kierowcy
class WasteRecordCreate(WasteRecordBase):
    pass

# schemat aktualizacja kierowcy
class WasteRecordUpdate(WasteRecordBase):
    contractor_id: Optional[int]
    user_id: Optional[int]
    waste_id: Optional[int]
    vehicle_id: Optional[int]
    driver_id: Optional[int]
    destination_id: Optional[int]
    transfer_date: Optional[date]
    mass_kg: Optional[float]
    price_per_kg: Optional[float]
    total_price: Optional[float]
    notes: Optional[str] = None

# Schemat do zwracania na GET
class WasteRecordOut(WasteRecordBase):
    id: int
    created_at: datetime
    edited_at: datetime

    class Config:
        orm_mode = True

# Schemat do filtrowania danych
class WasteRecordFilterParams(BaseModel):
    pass
