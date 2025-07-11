from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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

    class Config:
        orm_mode = True