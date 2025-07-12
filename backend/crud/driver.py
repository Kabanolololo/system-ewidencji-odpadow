from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.driver import Driver
from schema.driver import DriverBase, DriverCreate, DriverUpdate, DriverFilterParams

# Funkcja do pobierania wszystkich kierowców wraz z sortowaniem
def get_all_drivers(filters: DriverFilterParams, db: Session):
    query = db.query(Driver)

    # Filtrowanie po imieniu/nazwisku
    if filters.name:
        query = query.filter(Driver.name.ilike(f"%{filters.name}%"))
    if filters.surname:
        query = query.filter(Driver.surname.ilike(f"%{filters.surname}%"))
        
    # Sortowanie wybor czy imie/nazwisko
    if filters.sort_by:
        if filters.sort_by == "name":
            column = Driver.name
        elif filters.sort_by == "surname":
            column = Driver.surname
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

# Funckja do pobrania konkretnego kierowcy
def get_one_driver(driver_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if driver_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono kierowcy")
    return driver

# Funkcja do stworzenia kierowcy
def created_driver(driver: DriverCreate, db: Session):
    
    # Walidacja typu danych dla imienia i nazwiska
    if not driver.name.isalpha() or not driver.surname.isalpha():
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Imię i nazwisko powinny zawierać tylko litery"
    )
        
    # Dodanie kierowcy do bazy danych
    try:
        db_driver = Driver(**driver.dict())
        db.add(db_driver)
        db.commit()
        db.refresh(db_driver)
        return db_driver
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia kierowcy"
        ) from e

# Funkcja do aktualizacji kierowcy
def updated_driver(driver_id: int, driver: DriverUpdate, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if driver_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki kierowca
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()

    if not db_driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono kierowcy o id {driver_id}"
        )
        
    # Walidacja typu danych dla imienia i nazwiska
    if not driver.name.isalpha() or not driver.surname.isalpha():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Imię i nazwisko powinny zawierać tylko litery"
        )
    
    # Aktualizacja pól
    db_driver.name = driver.name
    db_driver.surname = driver.surname
    
    try:
        db.commit()
        db.refresh(db_driver)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Wystąpił błąd podczas aktualizacji kierowcy"
        )
    
    return db_driver
        
# Funkcja do usunięcia kierowcy
def deleted_driver(driver_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if driver_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki kierowca
    db_driver = db.query(Driver).filter(Driver.id == driver_id).first()

    if not db_driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono kierowcy o id {driver_id}"
        )
    
    # Usunięcie kierowcy
    db.delete(db_driver)
    db.commit()
    return {"message": "Usunięto kierowcę"}