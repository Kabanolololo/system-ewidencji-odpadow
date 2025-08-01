from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.driver import Driver
from schema.driver import DriverBase, DriverCreate, DriverUpdate, DriverFilterParams
from utils.driver import validate_id, get_by_id, validate_name_surname, format_driver_name_surname
from crud.audit_log import create_audit_log

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
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(driver_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_driver = get_by_id(driver_id, db)
    return db_driver

# Funkcja do stworzenia kierowcy
def created_driver(driver: DriverCreate, user_id: int, db: Session):
    # FUNKCJA: Walidacja imienia i nazwiska czy sa stringami
    validate_name_surname(driver.name, driver.surname)
    
    # FUNKCJA: Formatowanie imienia i nazwiska
    driver.name, driver.surname = format_driver_name_surname(driver.name, driver.surname)
        
    # Dodanie kierowcy do bazy danych
    try:
        db_driver = Driver(**driver.dict())
        db.add(db_driver)
        db.commit()
        db.refresh(db_driver)
        
        #FUNKCJA: tworzy i zapisuje log audytu w bazie  
        create_audit_log(db=db, user_id=user_id, table_name="drivers", record_id=db_driver.id, operation="create", old_data=None, new_data=db_driver)
    
        return db_driver
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia kierowcy"
        ) from e

# Funkcja do aktualizacji kierowcy
def updated_driver(driver_id: int, driver: DriverUpdate, user_id:int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(driver_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_driver = get_by_id(driver_id, db)
        
    # FUNKCJA: Walidacja imienia i nazwiska czy sa stringami
    validate_name_surname(driver.name, driver.surname)
    
    # FUNKCJA: Tworzy kopię starych danych
    old_data = db_driver.__dict__.copy()
    old_data.pop('_sa_instance_state', None)
    
    # FUNKCJA: Formatowanie imienia i nazwiska
    driver.name, driver.surname = format_driver_name_surname(driver.name, driver.surname)
    
    # Aktualizacja pól
    db_driver.name = driver.name
    db_driver.surname = driver.surname
    
    try:
        db.commit()
        db.refresh(db_driver)
        
        # FUNKCJA: Tworzy i zapisuje log audytu w bazie
        create_audit_log(db=db, user_id=user_id, table_name="drivers", record_id=db_driver.id, operation="update", old_data=old_data, new_data=db_driver)
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Wystąpił błąd podczas aktualizacji kierowcy o id {driver_id}"
        )
    
    return db_driver
        
# Funkcja do usunięcia kierowcy
def deleted_driver(driver_id: int, user_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(driver_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_driver = get_by_id(driver_id, db)
    
    #FUNKCJA: tworzy i zapisuje log audytu w bazie  
    create_audit_log(db=db, user_id=user_id, table_name="drivers", record_id=db_driver.id, operation="delete", old_data=db_driver, new_data=None)
    
    # Usunięcie kierowcy
    db.delete(db_driver)
    db.commit()
    return {"message": f"Usunięto kierowcę o id {driver_id}"}