from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schematy podstawowy dla destynacji
class DestinationBase(BaseModel):
    country: str
    voivodeship: Optional[str]
    city: str 
    postal_code: str
    address: str 

# schemat tworzenia destynacji
class DestinationCreate(DestinationBase):
    pass

# schemat aktualizacja destynacji
class DestinationUpdate(DestinationBase):
    country: Optional[str] 
    voivodeship: Optional[str]
    city: Optional[str]
    postal_code: Optional[str]
    address: Optional[str]

# Schemat do zwracania na GET
class DestinationOut(DestinationBase):
    id: int
    created_at: datetime
    edited_at: datetime
    
    class Config:
        orm_mode = True

# Schemat do filtrowania danych
class DestinationFilterParams(BaseModel):
    country: Optional[str] = Query(None)
    voivodeship: Optional[str] = Query(None)
    city: Optional[str] = Query(None)
    postal_code: Optional[str] = Query(None)
    address: Optional[str] = Query(None)
    sort_by: Optional[Literal["country", "voivodeship", "city", "postal_code","address"]] = Query("country")
    sort_order: Optional[Literal["asc", "desc"]] = Query("asc")