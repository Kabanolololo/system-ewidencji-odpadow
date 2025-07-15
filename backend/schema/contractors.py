from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schematy podstawowy dla firmy
class ContractorBase(BaseModel):
    nip: str = "1234567890"
    regon: str = "123456789"
    name: str = "Example Company Sp. z o.o."
    address: str = "ul. Przykładowa 1, 00-000 Warszawa"

# schemat tworzenia firmy
class ContractorCreate(ContractorBase):
    pass

# schemat tworzenia API VAT
class ContractorOnlineCreate(BaseModel):
    nip: str
    
# schemat aktualizacja firmy
class ContractorUpdate(BaseModel):
    nip: Optional[str]  = "0987654321"
    regon: Optional[str] = "0987654321"
    name: Optional[str] = "NotExample Company Sp. z o.o."
    address: Optional[str] = "ul. Aktualizacji 1, 00-000 Warszawa"

# Schemat do zwracania na GET
class ContractorOut(ContractorBase):
    id: int
    created_at: datetime
    edited_at: datetime

    class Config:
        orm_mode = True

# Schemat do filtrowania danych
class ContractorFilterParams(BaseModel):
    nip: Optional[str] = Query(None)
    regon: Optional[str] = Query(None)
    name: Optional[str] = Query(None)
    sort_by: Optional[Literal["nip", "regon", "name"]] = Query("nip")
    sort_order: Optional[Literal["asc", "desc"]] = Query("asc")