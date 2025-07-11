from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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

# schemat wyświetlanie odpadu
class WasteOut(WasteBase):
    id: int
    created_at: datetime
    edited_at: datetime

    class Config:
        orm_mode = True