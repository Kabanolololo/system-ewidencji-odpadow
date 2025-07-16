from fastapi import HTTPException, status
from typing import Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.driver import Driver

# Walidacja czy podajemy poprawną liczbę
def validate_id(driver_id: int):
    if driver_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie destynacji po id
def get_by_id(driver_id: int, db: Session) -> Driver:
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono kierowcy o id {driver_id}"
        )
    return driver

# Walidacja imienia i nazwiska czy sa stringami
def validate_name_surname(name: str, surname: str):
    if not name.isalpha() or not surname.isalpha():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Imię i nazwisko powinny zawierać tylko litery"
        )
