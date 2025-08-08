from fastapi import HTTPException, status
from typing import Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.vehicles import Vehicle

# Walidacja czy podajemy poprawną liczbę
def validate_id(car_id: int):
    if car_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie użytkownika po id
def get_by_id(car_id: int, db: Session) -> Vehicle:
    car = db.query(Vehicle).filter(Vehicle.id == car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono pojazdu o id {car_id}"
        )
    return car

# Sprawdzenie unikalnosci tablicy
def validate_registration_number(registration_number: str, db: Session, exclude_id: int = None):
    query = db.query(Vehicle).filter(Vehicle.registration_number == registration_number)
    
    # Jeśli edytujemy - ignoruj rekord o danym ID
    if exclude_id is not None:
        query = query.filter(Vehicle.id != exclude_id)
    
    plate = query.first()
    
    if plate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Podana tablica rejestracyjna o numerze {registration_number} jest już w systemie"
        )

# Formatowanie numeru rejestracyjnego
def format_registration_number(reg_number: str) -> str:
    return reg_number.replace(" ", "").upper()