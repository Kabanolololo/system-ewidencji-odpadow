from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models import WasteRecord, Contractor, User, Waste, Vehicle, Driver, Destination
from schema.waste_records import WasteRecordBase, WasteRecordCreate, WasteRecordFilterParams, WasteRecordOut, WasteRecordUpdate

def get_all_waste_records(filters: WasteRecordFilterParams, db: Session):
    query = db.query(WasteRecord)

    # Filtry dokładne (równe)
    if filters.contractor_id is not None:
        query = query.filter(WasteRecord.contractor_id == filters.contractor_id)
    if filters.user_id is not None:
        query = query.filter(WasteRecord.user_id == filters.user_id)
    if filters.waste_id is not None:
        query = query.filter(WasteRecord.waste_id == filters.waste_id)
    if filters.vehicle_id is not None:
        query = query.filter(WasteRecord.vehicle_id == filters.vehicle_id)
    if filters.driver_id is not None:
        query = query.filter(WasteRecord.driver_id == filters.driver_id)
    if filters.destination_id is not None:
        query = query.filter(WasteRecord.destination_id == filters.destination_id)

    # Filtry zakresowe
    if filters.transfer_date_from is not None:
        query = query.filter(WasteRecord.transfer_date >= filters.transfer_date_from)
    if filters.transfer_date_to is not None:
        query = query.filter(WasteRecord.transfer_date <= filters.transfer_date_to)

    if filters.mass_kg_min is not None:
        query = query.filter(WasteRecord.mass_kg >= filters.mass_kg_min)
    if filters.mass_kg_max is not None:
        query = query.filter(WasteRecord.mass_kg <= filters.mass_kg_max)

    if filters.price_per_kg_min is not None:
        query = query.filter(WasteRecord.price_per_kg >= filters.price_per_kg_min)
    if filters.price_per_kg_max is not None:
        query = query.filter(WasteRecord.price_per_kg <= filters.price_per_kg_max)

    # Sortowanie - ręczny wybór kolumny
    if filters.sort_by:
        if filters.sort_by == "contractor_id":
            column = WasteRecord.contractor_id
        elif filters.sort_by == "user_id":
            column = WasteRecord.user_id
        elif filters.sort_by == "waste_id":
            column = WasteRecord.waste_id
        elif filters.sort_by == "vehicle_id":
            column = WasteRecord.vehicle_id
        elif filters.sort_by == "driver_id":
            column = WasteRecord.driver_id
        elif filters.sort_by == "destination_id":
            column = WasteRecord.destination_id
        elif filters.sort_by == "transfer_date":
            column = WasteRecord.transfer_date
        elif filters.sort_by == "mass_kg":
            column = WasteRecord.mass_kg
        elif filters.sort_by == "price_per_kg":
            column = WasteRecord.price_per_kg
        elif filters.sort_by == "total_price":
            column = WasteRecord.total_price
        else:
            raise HTTPException(status_code=400, detail="Nieprawidłowe pole sortowania")

        if filters.sort_order == "desc":
            column = column.desc()
        else:
            column = column.asc()

        query = query.order_by(column)

    results = query.all()

    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brak ewidencji w systemie")

    return results

# Funckja do pobrania konkretnego rekordu
def get_one_waste_record(waste_record_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if waste_record_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki rekord
    db_record = db.query(WasteRecord).filter(WasteRecord.id == waste_record_id).first()
    if not db_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono wpisu o id {waste_record_id}"
        )
    
    return db_record

# Funkcja do stworzenia rekordu
def create_waste_record(waste_record: WasteRecordCreate, db: Session):
    # przecinek podmieniany na kropke
    mass_kg = waste_record.mass_kg
    price_per_kg = waste_record.price_per_kg

    if isinstance(mass_kg, str):
        mass_kg = mass_kg.replace(",", ".")
        mass_kg = float(mass_kg)

    if isinstance(price_per_kg, str):
        price_per_kg = price_per_kg.replace(",", ".")
        price_per_kg = float(price_per_kg)

    # walidacja id powiązanych rekordów
    contractor = db.query(Contractor).filter(Contractor.id == waste_record.contractor_id).first()
    if not contractor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kontrahent o ID {waste_record.contractor_id} nie istnieje"
        )

    user = db.query(User).filter(User.id == waste_record.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Użytkownik o ID {waste_record.user_id} nie istnieje"
        )

    waste = db.query(Waste).filter(Waste.id == waste_record.waste_id).first()
    if not waste:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Odpad o ID {waste_record.waste_id} nie istnieje"
        )

    vehicle = db.query(Vehicle).filter(Vehicle.id == waste_record.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pojazd o ID {waste_record.vehicle_id} nie istnieje"
        )

    driver = db.query(Driver).filter(Driver.id == waste_record.driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Kierowca o ID {waste_record.driver_id} nie istnieje"
        )

    destination = db.query(Destination).filter(Destination.id == waste_record.destination_id).first()
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Destynacja o ID {waste_record.destination_id} nie istnieje"
        )

    # walidacja daty (brak przyszłości)
    if waste_record.transfer_date > waste_record.transfer_date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data przekazania nie może być w przyszłości"
        )

    # Przeliczenie total_price
    expected_total_price = waste_record.mass_kg * waste_record.price_per_kg
    expected_total_price = round(expected_total_price,2)

    # Dodanie rekordu do bazy danych
    db_record = WasteRecord(
        contractor_id=waste_record.contractor_id,
        user_id=waste_record.user_id,
        waste_id=waste_record.waste_id,
        vehicle_id=waste_record.vehicle_id,
        driver_id=waste_record.driver_id,
        destination_id=waste_record.destination_id,
        transfer_date=waste_record.transfer_date,
        mass_kg=mass_kg,
        price_per_kg=price_per_kg,
        total_price=expected_total_price,
        notes=waste_record.notes
    )

    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


# Funkcja do aktualizacji rekordu
def update_waste_record(waste_record_id: int, waste_record: WasteRecordUpdate, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if waste_record_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki rekord
    db_record = db.query(WasteRecord).filter(WasteRecord.id == waste_record_id).first()
    if not db_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono rekordu o ID {waste_record_id}"
        )
    # Aktualizacja mass_kg, price_per_kg i total_price
    mass_kg = waste_record.mass_kg if waste_record.mass_kg is not None else db_record.mass_kg
    price_per_kg = waste_record.price_per_kg if waste_record.price_per_kg is not None else db_record.price_per_kg
    
    # przecinek podmieniany na kropke
    if isinstance(mass_kg, str):
        mass_kg = mass_kg.replace(",", ".")
        mass_kg = float(mass_kg)

    if isinstance(price_per_kg, str):
        price_per_kg = price_per_kg.replace(",", ".")
        price_per_kg = float(price_per_kg)

    db_record.mass_kg = mass_kg
    db_record.price_per_kg = price_per_kg
    db_record.total_price = mass_kg * price_per_kg
    db_record.total_price = round(db_record.total_price, 2)
    
    # Walidacja powiązanych ID
    if waste_record.contractor_id:
        contractor = db.query(Contractor).filter(Contractor.id == waste_record.contractor_id).first()
        if not contractor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Kontrahent o ID {waste_record.contractor_id} nie istnieje"
            )
        db_record.contractor_id = waste_record.contractor_id

    if waste_record.user_id:
        user = db.query(User).filter(User.id == waste_record.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Użytkownik o ID {waste_record.user_id} nie istnieje"
            )
        db_record.user_id = waste_record.user_id

    if waste_record.waste_id:
        waste = db.query(Waste).filter(Waste.id == waste_record.waste_id).first()
        if not waste:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Odpad o ID {waste_record.waste_id} nie istnieje"
            )
        db_record.waste_id = waste_record.waste_id

    if waste_record.vehicle_id:
        vehicle = db.query(Vehicle).filter(Vehicle.id == waste_record.vehicle_id).first()
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pojazd o ID {waste_record.vehicle_id} nie istnieje"
            )
        db_record.vehicle_id = waste_record.vehicle_id

    if waste_record.driver_id:
        driver = db.query(Driver).filter(Driver.id == waste_record.driver_id).first()
        if not driver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Kierowca o ID {waste_record.driver_id} nie istnieje"
            )
        db_record.driver_id = waste_record.driver_id

    if waste_record.destination_id:
        destination = db.query(Destination).filter(Destination.id == waste_record.destination_id).first()
        if not destination:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Miejsce docelowe o ID {waste_record.destination_id} nie istnieje"
            )
        db_record.destination_id = waste_record.destination_id

    # Aktualizacja daty (jeśli podano)
    if waste_record.transfer_date:
        if waste_record.transfer_date > waste_record.transfer_date.today():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Data nie może być w przyszłości"
            )
        db_record.transfer_date = waste_record.transfer_date

    # obsluga notatek
    if waste_record.notes is not None:
        db_record.notes = waste_record.notes

    db.commit()
    db.refresh(db_record)
    return db_record


# Funkcja do usunięcia rekordu
def delete_waste_record(waste_record_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if waste_record_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki rekord
    db_record = db.query(WasteRecord).filter(WasteRecord.id == waste_record_id).first()

    if not db_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono wpisu o id {waste_record_id}"
        )
    
    # Usunięcie rekordu
    db.delete(db_record)
    db.commit()
    return {"message": "Usunięto wpis z ewidencji"}