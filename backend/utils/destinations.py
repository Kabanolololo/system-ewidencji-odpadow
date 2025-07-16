from fastapi import HTTPException, status
from typing import Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.destinations import Destination

# Walidacja czy podajemy poprawną liczbę
def validate_id(destination_id: int):
    if destination_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie destynacji po id
def get_by_id(destination_id: int, db: Session) -> Destination:
    contractor = db.query(Destination).filter(Destination.id == destination_id).first()
    if not contractor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono destynacji o id {destination_id}"
        )
    return contractor