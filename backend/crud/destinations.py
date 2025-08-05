from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.destinations import Destination
from schema.destinations import DestinationBase, DestinationCreate, DestinationUpdate, DestinationOut,DestinationFilterParams
from utils.contractors import clean_address
from utils.destinations import validate_id, get_by_id, format_location_fields
import re
from crud.audit_log import create_audit_log

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
            detail="Brak destynacji w systemie"
        )
    
    return drivers

# Funckja do pobrania konkretnej destynacji
def get_one_destination(destination_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(destination_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_destination = get_by_id(destination_id, db)
    return db_destination

# Funkcja tworzenia destynacji
def create_destination(destination: DestinationCreate, user_id:int, db: Session):
    
    # FUNKCJA: formatowanie pól lokalizacji
    destination.country, destination.voivodeship, destination.city = format_location_fields(destination.country,destination.voivodeship,destination.city)
    
    # FUNKCJA: Czyszczenie adresu
    validate_address = clean_address(destination.address)
        
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
        
        #FUNKCJA: tworzy i zapisuje log audytu w bazie  
        create_audit_log(db=db, user_id=user_id, table_name="destinations", record_id=db_destination.id, operation="create", old_data=None, new_data=db_destination)
    
        return db_destination

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia adresu"
        ) from e

# Funkcja do aktualizacji destynacji
def update_destination(destination_id: int, destination: DestinationUpdate, user_id:int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(destination_id)
        
    # FUNKCJA: Pobieranie destynacji po id
    existing_destination = get_by_id(destination_id, db)
    
    # FUNKCJA: formatowanie pól lokalizacji
    destination.country, destination.voivodeship, destination.city = format_location_fields(destination.country,destination.voivodeship,destination.city)
    
    # FUNKCJA: Czyszczenie adresu
    validate_address = clean_address(destination.address)

    # WALIDACJA: czy inna destynacja w tym samym mieście nie ma takiego adresu
    existing_duplicate = db.query(Destination).filter(Destination.city == destination.city,Destination.address == validate_address,Destination.id != destination_id).first()

    if existing_duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adres '{validate_address}' w mieście '{destination.city}' jest już w systemie."
        )
    
    # FUNKCJA: Tworzy kopię starych danych
    old_data = existing_destination.__dict__.copy()
    old_data.pop('_sa_instance_state', None)

    # Aktualizacja
    existing_destination.country = destination.country
    existing_destination.voivodeship = destination.voivodeship
    existing_destination.city = destination.city
    existing_destination.postal_code = destination.postal_code
    existing_destination.address = validate_address

    try:
        db.commit()
        db.refresh(existing_destination)
        
        # FUNKCJA: Tworzy i zapisuje log audytu w bazie
        create_audit_log(db=db, user_id=user_id, table_name="destinations", record_id=existing_destination.id, operation="update", old_data=old_data, new_data=existing_destination)
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Wystąpił błąd podczas aktualizacji adresu"
        )
    
    return existing_destination

# Funkcja do usuwania destynacji
def delete_destination(destination_id: int, user_id:int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(destination_id)
        
    # FUNKCJA: Pobieranie destynacji po id
    existing_destination = get_by_id(destination_id, db)
    
    #FUNKCJA: tworzy i zapisuje log audytu w bazie  
    create_audit_log(db=db, user_id=user_id, table_name="destinations", record_id=existing_destination.id, operation="delete", old_data=existing_destination, new_data=None)
    
    # Usuniecie destynacji
    db.delete(existing_destination)
    db.commit()
    return {"message": f"Usunięto adres o id {destination_id}"}