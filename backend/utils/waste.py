from fastapi import HTTPException, status
from typing import Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.waste import Waste

# Walidacja czy podajemy poprawną liczbę
def validate_id(waste_id: int):
    if waste_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie kodu po id
def get_by_id(waste_id: int, db: Session) -> Waste:
    waste = db.query(Waste).filter(Waste.id == waste_id).first()
    if not waste:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono kodu odpadu o id {waste_id}"
        )
    return waste

# Walidacja długosci kodu
def validate_waste_code_length(code: str):
    if len(code) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod odpadu musi mieć dokładnie 6 znaków"
        )

# Walidacja typu danych kodu
def validate_waste_code_is_digit(code: str):
    if not code.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod odpadu musi być liczbą"
        )

# Walidacja unikalnosci kodu w bazie
def validate_waste_code_unique(code: str, db: Session, waste_id: Optional[int] = None):
    query = db.query(Waste).filter(Waste.code == code)
    if waste_id:
        query = query.filter(Waste.id != waste_id)  # przy update nie sprawdzaj samego siebie
    if query.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Odpady z kodem '{code}' już istnieją"
        )