from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schematy podstawowy dla dziennika zdarzeń
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