from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Literal
from fastapi import Query

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
    contractor_id: Optional[int] = Query(None)
    user_id: Optional[int] = Query(None)
    waste_id: Optional[int] = Query(None)
    vehicle_id: Optional[int] = Query(None)
    driver_id: Optional[int] = Query(None)
    destination_id: Optional[int] = Query(None)
    transfer_date_from: Optional[date] = Query(None)  # zakres od
    transfer_date_to: Optional[date] = Query(None)    # zakres do
    mass_kg_min: Optional[float] = Query(None)       # minimalna masa
    mass_kg_max: Optional[float] = Query(None)       # maksymalna masa
    price_per_kg_min: Optional[float] = Query(None)
    price_per_kg_max: Optional[float] = Query(None)
    total_price_min: Optional[float] = Query(None)
    total_price_max: Optional[float] = Query(None)

    sort_by: Optional[Literal[
        "contractor_id", "user_id", "waste_id", "vehicle_id", "driver_id", 
        "destination_id", "transfer_date", "mass_kg", "price_per_kg", "total_price"
    ]] = Query("transfer_date")

    sort_order: Optional[Literal["asc", "desc"]] = Query("desc")