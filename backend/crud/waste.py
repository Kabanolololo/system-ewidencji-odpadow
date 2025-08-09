from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.waste import Waste
from schema.waste import WasteBase, WasteCreate, WasteUpdate, WasteOut, WasteFilterParams
from utils.waste import validate_id, get_by_id,validate_waste_code_length, validate_waste_code_is_digit, validate_waste_code_unique
from crud.audit_log import create_audit_log, serialize_sqlalchemy_obj

# Funkcja do pobierania wszystkich odpadów
def get_all_waste(filters: WasteFilterParams,db: Session):
    query = db.query(Waste)
    
    # Filtrowanie po kodzie odpadu
    if filters.code:
        query = query.filter(Waste.code.ilike(f"%{filters.code}%"))
    
    # Sortowanie zmusza po kodzie odpadu
    if filters.sort_by:
        if filters.sort_by == "code":
            column = Waste.code
        else:
            raise HTTPException(status_code=400, detail="Nieprawidłowe pole sortowania")
        
        # Sortowanie asc/desc
        if filters.sort_order == "desc":
            column = column.desc()
        else:
            column = column.asc()
        
        query = query.order_by(column)
        
    waste = query.all()
    
    if not waste:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brak odpadów w systemie")
    return waste

# Funckja do pobrania konkretnego odpadu
def get_one_waste(waste_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(waste_id)
    
    # FUNKCJA: Pobieranie kodu po id
    db_waste = get_by_id(waste_id, db)
    return db_waste

# Funkcja do stworzenia odpadu
def created_waste(waste: WasteCreate, user_id: int, db: Session):
    # FUNKCJA:  Walidacja długosci kodu
    validate_waste_code_length(waste.code)
    
    # FUNKCJA:  Walidacja typu danych kodu
    validate_waste_code_is_digit(waste.code)
    
    # FUNKCJA: Walidacja unikalnosci kodu w bazie
    validate_waste_code_unique(waste.code, db)

    # dodanie odpadu do bazy
    try:
        db_waste = Waste(**waste.dict())
        db.add(db_waste)
        db.commit()
        db.refresh(db_waste)

        #FUNKCJA: tworzy i zapisuje log audytu w bazie  
        create_audit_log(db=db, user_id=user_id, table_name="wastes", record_id=db_waste.id, operation="create", old_data=None, new_data=db_waste)

        return db_waste
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia odpadu"
        ) from e

# Funkcja do aktualizacji odpadu
def updated_waste(waste_id: int, waste: WasteUpdate, user_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(waste_id)

    # FUNKCJA: Pobieranie rekordu po id
    existing_waste = get_by_id(waste_id, db)

    # FUNKCJA: Walidacja długości kodu
    validate_waste_code_length(waste.code)

    # FUNKCJA: Walidacja typu danych kodu
    validate_waste_code_is_digit(waste.code)

    # FUNKCJA: Walidacja unikalności kodu w bazie
    validate_waste_code_unique(waste.code, db, waste_id=waste_id)

    # FUNKCJA: Tworzy kopię starych danych
    old_data = existing_waste.__dict__.copy()
    old_data.pop('_sa_instance_state', None)

    # FUNKCJA: Aktualizacja pól
    existing_waste.code = waste.code
    existing_waste.name = waste.name
    existing_waste.notes = waste.notes

    try:
        db.commit()
        db.refresh(existing_waste)

        # FUNKCJA: Tworzy kopię nowych danych
        new_data = existing_waste.__dict__.copy()
        new_data.pop('_sa_instance_state', None)

        # FUNKCJA: Tworzy i zapisuje log audytu w bazie
        create_audit_log(db=db, user_id=user_id, table_name="waste", record_id=existing_waste.id, operation="update", old_data=old_data, new_data=new_data)

        return existing_waste

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas aktualizacji odpadu"
        ) from e

# Funkcja do usunięcia odpadu
def deleted_waste(waste_id: int,  user_id: int, db: Session):
     # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(waste_id)
    
    # FUNKCJA: Pobieranie kodu po id
    existing_waste = get_by_id(waste_id, db)
    
    #FUNKCJA: tworzy i zapisuje log audytu w bazie  
    create_audit_log(db=db, user_id=user_id, table_name="waste", record_id=existing_waste.id, operation="delete", old_data=existing_waste, new_data=None)
    
    # Usunięcie odpadu
    db.delete(existing_waste)
    db.commit()
    return {"message": "Usunięto kod odpadu"}