from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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