from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schemat podstawowy dla samochodu
class VehicleBase(BaseModel):
    registration_number: str = "EZD1111J"
    brand: str = "Iveco"
    model: str = "Daily"

# schemat tworzenia samochodu
class VehicleCreate(VehicleBase):
    pass

# schemat aktualizacja samochodu
class VehicleUpdate(VehicleBase):
    registration_number: Optional[str] = "EZD1111J"
    brand: Optional[str] = "Citroen"
    model: Optional[str] = "Jumper"

# Schemat do zwracania na GET
class VechicleOut(VehicleBase):
    id: int
    created_at: datetime
    edited_at: datetime
    
    class Config:
        orm_mode = True

# Schemat do filtrowania danych
class VehicleFilterParams(BaseModel):
    registration_number: Optional[str] = Query(None)
    sort_by: Optional[Literal["registration_number"]] = Query("registration_number")
    sort_order: Optional[Literal["asc", "desc"]] = Query("asc")
