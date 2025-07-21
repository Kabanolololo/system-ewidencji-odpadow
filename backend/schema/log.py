from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from fastapi import Query

# Schemat do zwracania na GET
class AuditLogOut(BaseModel):
    id: int
    user_id: int
    table_name: str
    record_id: int
    operation: str
    old_data: Optional[dict] = None
    new_data: Optional[dict] = None
    created_at: datetime

    class Config:
        orm_mode = True
        
# Schemat do filtrowania danych
class AuditLogParams(BaseModel):
    table_name: Optional[Literal["wastes","waste_records","vehicles","users","drivers","destinations","contractors"]] = Query(None)
    operation: Optional[Literal["create","update","delete"]] = Query(None)
    sort_by: Optional[Literal["table_name","operation","created_at"]] = Query("table_name")
    sort_order: Optional[Literal["asc", "desc"]] = Query("asc")