from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.destinations import Destination
from schema.destinations import DestinationBase, DestinationCreate, DestinationUpdate, DestinationOut,DestinationFilterParams
import re

# Funkcja do pobierania wszystkich destynacji wraz z filtrowaniem
def get_all_destinations(filters: DestinationFilterParams, db: Session):
    query = db.query(Destination)
    
    # Filtrowanie po kraj/wojewodztwo/miasto/kod pocztowy/adres
    if filters.country:
        query = query.filter(Destination.country.ilike(f"%{filters.country}%"))
    if filters.voivodeship:
        query = query.filter(Destination.voivodeship.ilike(f"%{filters.voivodeship}%"))
    if filters.city:
        query = query.filter(Destination.city.ilike(f"%{filters.city}%"))
    if filters.postal_code:
        query = query.filter(Destination.postal_code.ilike(f"%{filters.postal_code}%"))
    if filters.address:
        query = query.filter(Destination.address.ilike(f"%{filters.address}%"))
        
    # Sortowanie wybor kraj/wojewodztwo/miasto/kod pocztowy/adres
    if filters.sort_by:
        if filters.sort_by == "country":
            column = Destination.country
        elif filters.sort_by == "voivodeship":
            column = Destination.voivodeship
        elif filters.sort_by == "city":
            column = Destination.city
        elif filters.sort_by == "postal_code":
            column = Destination.postal_code
        elif filters.sort_by == "address":
            column = Destination.address
        else:
            raise HTTPException(status_code=400, detail="Nieprawidłowe pole sortowania")
        
        # Sortowanie asc/desc
        if filters.sort_order == "desc":
            column = column.desc()
        else:
            column = column.asc()
        
        query = query.order_by(column)
        
    drivers = query.all()
    
    if not drivers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brak kierowców w systemie"
        )
    
    return drivers

# Funckja do pobrania konkretnej destynacji
def get_one_destination(destination_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if destination_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    car = db.query(Destination).filter(Destination.id == destination_id).first()
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono podanego adresu")
    return car

# Funkcja tworzenia destynacji
def create_destination(destination: DestinationCreate, db: Session):
    # Walidacja ul.
    validate_address = destination.address.strip()
    # Zamień wielokrotne spacje na jedną
    validate_address = re.sub(r'\s+', ' ', validate_address)
    # Usuń 'ul.' z przodu
    validate_address = re.sub(r'^(ul\.?\s*)', '', validate_address, flags=re.IGNORECASE)
    validate_address = f"ul. {validate_address}" 
        
    # Walidacja czy adresy sie nie powtarzają w mieście
    existing_destination = db.query(Destination).filter(Destination.city == destination.city,Destination.address == validate_address).first()

    if existing_destination:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,  detail=f"Adres '{destination.address}' w mieście '{destination.city}' jest już w systemie.")
    
    # Dodanie destynacji do bazy danych
    try:
        db_destination = Destination(**destination.dict())
        db_destination.address = validate_address
        db.add(db_destination)
        db.commit()
        db.refresh(db_destination)
        return db_destination

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia adresu"
        ) from e

# Funkcja do aktualizacji destynacji
def update_destination(destination_id: int, destination: DestinationUpdate, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if destination_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
        
    # Pobierz istniejącą destynację
    existing_destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if not existing_destination:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Nie znaleziono adresu o ID {destination_id}")

    # Walidacja i czyszczenie adresu
    validate_address = destination.address.strip()
    validate_address = re.sub(r'\s+', ' ', validate_address)
    validate_address = re.sub(r'^(u[lL]?\.?\s*)+', '', validate_address, flags=re.IGNORECASE)
    validate_address = f"ul. {validate_address}"

    # WALIDACJA: czy inna destynacja w tym samym mieście nie ma takiego adresu
    existing_duplicate = db.query(Destination).filter(Destination.city == destination.city,Destination.address == validate_address,Destination.id != destination_id).first()

    if existing_duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adres '{validate_address}' w mieście '{destination.city}' jest już w systemie."
        )
    
    # Aktualizacja
    existing_destination.country = destination.country
    existing_destination.voivodeship = destination.voivodeship
    existing_destination.city = destination.city
    existing_destination.postal_code = destination.postal_code
    existing_destination.address = validate_address

    try:
        db.commit()
        db.refresh(existing_destination)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Wystąpił błąd podczas aktualizacji adresu"
        )
    
    return existing_destination

# Funkcja do usuwania destynacji
def delete_destination(destination_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if destination_id < 1:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Podaj dodatnią liczbę"
        )
        
    # Pobierz istniejąca destynacje + walidacja czy jest
    existing_destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if not existing_destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono adresu o ID {destination_id}"
        )
    
    # Usuniecie destynacji
    db.delete(existing_destination)
    db.commit()
    return {"message": "Usunięto adres"}