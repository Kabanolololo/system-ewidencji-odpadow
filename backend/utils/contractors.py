from fastapi import HTTPException, status
from typing import Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.contractors import Contractor
import re

# Funkcja do czyszczenia adresów
def clean_address(address: str) -> str:
    address_clean = address.strip()
    address_clean = re.sub(r'\s+', ' ', address_clean)
    address_clean = re.sub(r'^(u[lL]?\.?\s*)+', '', address_clean, flags=re.IGNORECASE)
    return f"ul. {address_clean}"

# Walidacja czy podajemy poprawną liczbę
def validate_id(contractor_id: int):
    if contractor_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie kontrahenta po id
def get_by_id(contractor_id: int, db: Session) -> Contractor:
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono kontrahenta o id {contractor_id}"
        )
    return contractor

# Walidacja NIP/REGON
def validate_nip_regon(nip: Optional[str], regon: Optional[str]):
    errors = []
    if nip and not nip.isnumeric():
        errors.append("NIP musi składać się tylko z cyfr")
    if regon and not regon.isnumeric():
        errors.append("REGON musi składać się tylko z cyfr")
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors
        )

# Walidacja czy NIP/REGON znajdują sie w bazie danych
def check_unique(db: Session, nip: Optional[str], regon: Optional[str], exclude_id: Optional[int] = None):
    if nip:
        query = db.query(Contractor).filter(Contractor.nip == nip)
        if exclude_id:
            query = query.filter(Contractor.id != exclude_id)
        if query.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Kontrahent z podanym NIP ({nip}) już istnieje"
            )

    if regon:
        query = db.query(Contractor).filter(Contractor.regon == regon)
        if exclude_id:
            query = query.filter(Contractor.id != exclude_id)
        if query.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Kontrahent z podanym REGON ({regon}) już istnieje"
            )