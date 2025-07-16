from fastapi import HTTPException, status
from typing import Optional, Literal, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models import WasteRecord, Contractor, User, Waste, Vehicle, Driver, Destination

# Walidacja czy podajemy poprawną liczbę
def validate_id(waste_record_id: int):
    if waste_record_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie użytkownika po id
def get_by_id(waste_record_id: int, db: Session) -> WasteRecord:
    car = db.query(WasteRecord).filter(WasteRecord.id == waste_record_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono rekordu o id {waste_record_id}"
        )
    return car

# Parsowanie na float
def parse_float(value: Union[str, float]) -> float:
    if isinstance(value, str):
        value = value.replace(",", ".")
        return float(value)
    return float(value)

# Obliczanie ceny
def calculate_total_price(mass_kg: float, price_per_kg: float) -> float:
    return round(mass_kg * price_per_kg, 2)

# Uniwersalna walidacja  ID powiazanego obiektu
def get_or_404(db: Session, model, object_id: int, object_name: str):
    obj = db.query(model).filter(model.id == object_id).first()
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{object_name} o ID {object_id} nie istnieje"
        )
    return obj

# Walidacja daty 
def validate_not_future_date(date_value):
    date_today = date_value.today()
    if date_value > date_today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Data przekazania nie może być w przyszłości. Aktualna data to {date_today}, a została przekzana {date_value}"
        )