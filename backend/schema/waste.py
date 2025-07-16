from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schematy podstawowy do odpadów
class WasteBase(BaseModel):
    code: str = "150101"
    name: str = "Opakowania z papieru i tektury"
    notes: Optional[str] = "łącznie z selektywnie gromadzonymi komunalnymi odpadami opakowaniowymi"

# schemat tworzenie odpadu
class WasteCreate(WasteBase):
    pass

# schemat aktualizacja odpadu
class WasteUpdate(BaseModel):
    code: str = "150102"
    name: str = "Folia"
    notes: Optional[str] = None

# Schemat do zwracania na GET
class WasteOut(WasteBase):
    id: int
    created_at: datetime
    edited_at: datetime
    
    class Config:
        orm_mode = True

# Schemat do filtrowania danych
class WasteFilterParams(BaseModel):
    code: Optional[str] = Query(None)
    sort_by: Optional[Literal["code"]] = Query("code")
    sort_order: Optional[Literal["asc", "desc"]] = Query("asc")