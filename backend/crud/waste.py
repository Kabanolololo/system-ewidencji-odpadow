from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.waste import Waste
from schema.waste import WasteBase, WasteCreate, WasteUpdate, WasteOut

# Funkcja do pobierania wszystkich odpadów
def get_all_waste(db: Session):
    wastes = db.query(Waste).all()
    if not wastes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brak danych odpadów w systemie")
    return wastes

# Funckja do pobrania konkretnego odpadu
def get_one_waste(waste_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if waste_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    waste = db.query(Waste).filter(Waste.id == waste_id).first()
    if not waste:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono odpadu")
    return waste

# Funkcja do stworzenia odpadu
def created_waste(waste: WasteCreate, db: Session):
    # Walidacja czy istneieje już ten odpad
    existing_waste = db.query(Waste).filter(Waste.code == waste.code).first()
    if existing_waste:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Odpady z kodem '{waste.code}' już istnieją."
        )
    
    # Walidacja długości kodu
    if len(waste.code) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod odpadu musi mieć dokładnie 6 znaków."
        )
    
    # Walidacja typu danych
    if not waste.code.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod odpadu musi być liczbą."
        )
    
    # Dodanie kodu do bazy danych
    try:
        db_waste = Waste(**waste.dict())
        db.add(db_waste)
        db.commit()
        db.refresh(db_waste)
        return db_waste
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia odpadu."
        ) from e

# Funkcja do aktualizacji odpadu
def updated_waste(waste_id: int, waste: WasteUpdate, db: Session):
    # Walidacja czy istnieje taki odpad
    existing_waste = db.query(Waste).filter(Waste.id == waste_id).first()
    
    if not existing_waste:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono odpadu o id {waste_id}"
        )
    
    # Walidacja długości kodu
    if len(waste.code) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod odpadu musi mieć dokładnie 6 znaków."
        )
    
    # Walidacja typu danych
    if not waste.code.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kod odpadu musi być liczbą."
        )
    
    # Aktualizacja pól
    existing_waste.code = waste.code
    existing_waste.name = waste.name
    existing_waste.notes = waste.notes
    
    try:
        db.commit()
        db.refresh(existing_waste)
        return existing_waste
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas aktualizacji odpadu."
        ) from e

# Funkcja do usunięcia odpadu
def deleted_waste(waste_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if waste_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki odpad
    existing_waste = db.query(Waste).filter(Waste.id == waste_id).first()
    
    if not existing_waste:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono odpadu o id {waste_id}"
        )
    
    # Usunięcie odpadu
    db.delete(existing_waste)
    db.commit()
    return {"message": "Usunięto kod odpadu"}