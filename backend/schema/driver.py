from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schematy podstawowy dla kierowców
class DriverBase(BaseModel):
    name: str = "Jan"
    surname: str = "Kowalski"

# schemat tworzenia kierowcy
class DriverCreate(DriverBase):
    pass

# schemat aktualizacja kierowcy
class DriverUpdate(DriverBase):
    name: Optional[str] = "Edyta"
    surname: Optional[str] = "Miłoszewska"

# Schemat do zwracania na GET
class DriverOut(DriverBase):
    id: int

    class Config:
        orm_mode = True

# Schemat do filtrowania danych
class DriverFilterParams(BaseModel):
    name: Optional[str] = Query(None)
    surname: Optional[str] = Query(None)
    sort_by: Optional[Literal["name", "surname"]] = Query("surname")
    sort_order: Optional[Literal["asc", "desc"]] = Query("asc")