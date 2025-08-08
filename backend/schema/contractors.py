from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schematy podstawowy dla firmy
class ContractorBase(BaseModel):
    nip: str 
    regon: str 
    name: str 
    address: str 

# schemat tworzenia firmy
class ContractorCreate(ContractorBase):
    pass

# schemat tworzenia API VAT
class ContractorOnlineCreate(BaseModel):
    nip: str
    
# schemat aktualizacja firmy
class ContractorUpdate(BaseModel):
    nip: Optional[str] 
    regon: Optional[str]
    name: Optional[str] 
    address: Optional[str]

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