from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schemat podstawowy dla usera
class UserBase(BaseModel):
    name: str
    surname: str

# schemat tworzenia usera
class UserCreate(UserBase):
    password_hash: str
    role: Literal["admin", "user"]

# schemat aktualizacja usera
class UserUpdate(UserBase):
    name: Optional[str] = None
    surname: Optional[str] = None
    password_hash: Optional[str] = None

# schemat aktualizacja usera - admin
class UserAdminUpdate(UserBase):
    name: Optional[str] = None
    surname: Optional[str] = None
    password_hash: Optional[str] = None
    role: Optional[Literal["admin", "user"]] = None

# Schemat do zwracania na GET
class UserOut(BaseModel):
    id: int
    name: str
    surname: str
    username: str
    role: str
    created_at: datetime
    edited_at: datetime

    class Config:
        orm_mode = True

# Schemat do filtrowania usera
class UserFilterParams(BaseModel):
    name: Optional[str] = Query(None)
    surname: Optional[str] = Query(None)
    role: Optional[Literal["admin","user"]] = Query(None)
    sort_by: Optional[Literal["name", "surname", "role"]] = Query("surname")
    sort_order: Optional[Literal["asc", "desc"]] = Query("asc")
