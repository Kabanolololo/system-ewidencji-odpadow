from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, Literal
from fastapi import Query

# Model do zwracania użytkownika w kontekście rekordu
class UserOut(BaseModel):
    username: str

    class Config:
        orm_mode = True

# Model do zwracania kontrahenta w kontekście rekordu
class ContractorOut(BaseModel):
    nip: str

    class Config:
        orm_mode = True
        
# Model do zwracania odpadu w kontekście rekordu
class WasteOut(BaseModel):
    code: str

    class Config:
        orm_mode = True

# Model do zwracania pojazdu w kontekście rekordu
class VehicleOut(BaseModel):
    registration_number: str

    class Config:
        orm_mode = True

# Model do zwracania kierowcy w kontekście rekordu
class DriverOut(BaseModel):
    full_name: str

    class Config:
        orm_mode = True

# Model do zwracania destynacji w kontekście rekordu
class DestinationOut(BaseModel):
    return_destination: str

    class Config:
        orm_mode = True

# Schematy podstawowy dla rekordu
class WasteRecordBase(BaseModel):
    contractor: ContractorOut
    user: UserOut
    waste: WasteOut
    vehicle: VehicleOut
    driver: DriverOut
    destination: DestinationOut
    transfer_date: date
    mass_kg: float
    price_per_kg: float
    total_price: float
    notes: Optional[str] = None

# schemat tworzenia kierowcy
class WasteRecordCreate(BaseModel):
    contractor_id: int = None
    user_id: int = None
    waste_id: int = None
    vehicle_id: int = None
    driver_id: int = None
    destination_id: int = None
    transfer_date: date = None
    mass_kg: float = None
    price_per_kg: float = None
    notes: Optional[str] = None

# schemat aktualizacja kierowcy
class WasteRecordUpdate(BaseModel):
    contractor_id: Optional[int] = None
    user_id: Optional[int] = None
    waste_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    destination_id: Optional[int] = None
    transfer_date: Optional[date] = None
    mass_kg: Optional[float] = None
    price_per_kg: Optional[float] = None
    total_price: Optional[float] = None
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
    contractor_nip: Optional[str] = Query(None)
    user_username: Optional[str] = Query(None)
    waste_code: Optional[str] = Query(None)
    vehicle_registration_number: Optional[str] = Query(None)
    driver_full_name: Optional[str] = Query(None)
    destination_name: Optional[str] = Query(None)

    transfer_date_from: Optional[date] = Query(None)
    transfer_date_to: Optional[date] = Query(None)
    mass_kg_min: Optional[float] = Query(None)
    mass_kg_max: Optional[float] = Query(None)
    price_per_kg_min: Optional[float] = Query(None)
    price_per_kg_max: Optional[float] = Query(None)
    total_price_min: Optional[float] = Query(None)
    total_price_max: Optional[float] = Query(None)

    sort_by: Optional[Literal[
        "contractor_nip", "user_username", "waste_code", 
        "vehicle_registration_number", "driver_full_name",
        "destination_name", "transfer_date", "mass_kg", 
        "price_per_kg", "total_price"
    ]] = Query("transfer_date")

    sort_order: Optional[Literal["asc", "desc"]] = Query("desc")