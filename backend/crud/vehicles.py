from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.vehicles import Vehicle
from schema.vehicles import VehicleBase, VehicleCreate, VehicleUpdate, VehicleFilterParams
from utils.vehicles import validate_id, get_by_id, validate_registration_number, format_registration_number
from crud.audit_log import create_audit_log

# Funkcja do pobierania wszystkich samochodów
def get_all_cars(filters: VehicleFilterParams,db: Session):
    query = db.query(Vehicle)
    
    # Filtrowanie po rejestracji
    if filters.registration_number:
        query = query.filter(Vehicle.registration_number.ilike(f"%{filters.registration_number}%"))
    
    # Sortowanie zmusza po rejestracji
    if filters.sort_by:
        if filters.sort_by == "registration_number":
            column = Vehicle.registration_number
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brak pojazdów w systemie")
    return drivers

# Funckja do pobrania konkretnego samochodu
def get_one_car(car_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(car_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_car = get_by_id(car_id, db)
    return db_car

# Funkcja tworzenia samochodu
def created_car(car: VehicleCreate, user_id: int, db: Session):
    
    # Funkcja: Formatowanie numeru rejestracyjnego
    car.registration_number = format_registration_number(car.registration_number)

    # FUNKCJA: Sprawdzenie unikalnosci tablicy
    validate_registration_number(car.registration_number, db)
    
    # Dodanie pojazdu do bazy danych
    try:
        db_car = Vehicle(**car.dict())
        db.add(db_car)
        db.commit()
        db.refresh(db_car)
        
        #FUNKCJA: tworzy i zapisuje log audytu w bazie  
        create_audit_log(db=db, user_id=user_id, table_name="vehicles", record_id=db_car.id, operation="create", old_data=None, new_data=db_car)
        
        return db_car
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia pojazdu"
        ) from e

# Funkcja do aktualizacji samochodu
def updated_car(car_id: int, car: VehicleUpdate, user_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(car_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    existing_car = get_by_id(car_id, db)

    # Funkcja: Formatowanie numeru rejestracyjnego
    car.registration_number = format_registration_number(car.registration_number)
    
    # FUNKCJA: Sprawdzenie unikalnosci tablicy
    validate_registration_number(car.registration_number, db, exclude_id=car_id)
    
    # FUNKCJA: Tworzy kopię starych danych
    old_data = existing_car.__dict__.copy()
    old_data.pop('_sa_instance_state', None)

    # Aktualizacja pól
    existing_car.registration_number = car.registration_number
    existing_car.brand = car.brand
    existing_car.model = car.model
    
    try:
        db.commit()
        db.refresh(existing_car)
        
        # FUNKCJA: Tworzy kopię nowych danych
        new_data = existing_car.__dict__.copy()
        new_data.pop('_sa_instance_state', None)
        
        # FUNKCJA: Tworzy i zapisuje log audytu w bazie
        create_audit_log(db=db, user_id=user_id, table_name="vehicles", record_id=existing_car.id, operation="update", old_data=old_data, new_data=new_data)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Wystąpił błąd podczas aktualizacji pojazdu o id {car_id}"
        )
    
    return existing_car

# Funkcja do usuwania samochodu
def deleted_car(car_id: int, user_id:int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(car_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    existing_car = get_by_id(car_id, db)
    
    #FUNKCJA: tworzy i zapisuje log audytu w bazie  
    create_audit_log(db=db, user_id=user_id, table_name="vehicles", record_id=existing_car.id, operation="delete", old_data=existing_car, new_data=None)
    
    # Usuniecie samochodu
    db.delete(existing_car)
    db.commit()
    return {"message": f"Usunięto pojazd o id {car_id}"}