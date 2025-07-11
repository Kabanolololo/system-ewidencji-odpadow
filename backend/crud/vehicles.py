from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.vehicles import Vehicle
from schema.vehicles import VehicleBase, VehicleCreate, VehicleUpdate

# Funkcja do pobierania wszystkich samochodów
def get_all_cars(db: Session):
    cars = db.query(Vehicle).all()
    if not cars:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brak pojazdów w systemie")
    return cars

# Funckja do pobrania konkretnego samochodu
def get_one_car(car_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if car_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    car = db.query(Vehicle).filter(Vehicle.id == car_id).first()
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono pojazdu.")
    return car

# Funkcja tworzenia samochodu
def created_car(car: VehicleCreate, db: Session):
    # Walidacja czy istnieje taki samochod z rejestacja
    plate = db.query(Vehicle).filter(Vehicle.registration_number==car.registration_number).first()
    
    if plate:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podana tablica rejestracyjna jest już w systemie")
    
    # Dodanie pojazdu do bazy danych
    try:
        db_car = Vehicle(**car.dict())
        db.add(db_car)
        db.commit()
        db.refresh(db_car)
        return db_car
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia pojazdu."
        ) from e

# Funkcja do aktualizacji samochodu
def updated_car(car_id: int, car: VehicleUpdate, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if car_id < 1:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Podaj dodatnią liczbę"
        )
    
    # Pobierz istniejący samochód + walidacja czy jest
    existing_car = db.query(Vehicle).filter(Vehicle.id == car_id).first()
    if not existing_car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono pojazdu o ID {car_id}."
        )

    # Walidacja czy tablica rejestracyjna już istnieje w innym samochodzie
    plate = db.query(Vehicle).filter(
        Vehicle.registration_number == car.registration_number,
        Vehicle.id != car_id  # ignoruj samego siebie
    ).first()
    if plate:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Podana tablica rejestracyjna jest już w systemie."
        )

    # Aktualizacja pól
    existing_car.registration_number = car.registration_number
    existing_car.brand = car.brand
    existing_car.model = car.model
    
    try:
        db.commit()
        db.refresh(existing_car)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Wystąpił błąd podczas aktualizacji pojazdu."
        )
    
    return existing_car

# Funkcja do usuwania samochodu
def deleted_car(car_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if car_id < 1:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Podaj dodatnią liczbę"
        )
        
    # Pobierz istniejący samochód + walidacja czy jest
    existing_car = db.query(Vehicle).filter(Vehicle.id == car_id).first()
    if not existing_car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono pojazdu o ID {car_id}."
        )
    
    # Usuniecie samochodu
    db.delete(existing_car)
    db.commit()
    return {"message": "Usunięto pojazd"}