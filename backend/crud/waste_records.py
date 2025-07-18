from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models import WasteRecord, Contractor, User, Waste, Vehicle, Driver, Destination
from schema.waste_records import WasteRecordBase, WasteRecordCreate, WasteRecordFilterParams, WasteRecordOut, WasteRecordUpdate
from utils.waste_records import validate_id, get_by_id, parse_float, get_or_404, validate_not_future_date, calculate_total_price

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

    if filters.total_price_min is not None:
        query = query.filter(WasteRecord.total_price >= filters.total_price_min)
    if filters.total_price_max is not None:
        query = query.filter(WasteRecord.total_price <= filters.total_price_max)

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
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(waste_record_id)
    
    # FUNKCJA: Pobieranie rekordu po id
    db_record = get_by_id(waste_record_id, db)
    return db_record

# Funkcja do stworzenia rekordu
def create_waste_record(waste_record: WasteRecordCreate, db: Session):
    # FUNKCJA: Parsowanie na float
    mass_kg = parse_float(waste_record.mass_kg)
    price_per_kg = parse_float(waste_record.price_per_kg)

    # FUNKCJE: Uniwersalna walidacja  ID powiazanego obiektu
    contractor = get_or_404(db, Contractor, waste_record.contractor_id, "Kontrahent")
    user = get_or_404(db, User, waste_record.user_id, "Użytkownik")
    waste = get_or_404(db, Waste, waste_record.waste_id, "Odpad")
    vehicle = get_or_404(db, Vehicle, waste_record.vehicle_id, "Pojazd")
    driver = get_or_404(db, Driver, waste_record.driver_id, "Kierowca")
    destination = get_or_404(db, Destination, waste_record.destination_id, "Destynacja")

    # FUNKCJA: Walidacja daty 
    validate_not_future_date(waste_record.transfer_date)

    # FUNKCJA: Obliczanie ceny
    total_price = calculate_total_price(mass_kg, price_per_kg)

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
        total_price=total_price,
        notes=waste_record.notes
    )

    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# Funkcja do aktualizacji rekordu
def update_waste_record(waste_record_id: int, waste_record: WasteRecordUpdate, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(waste_record_id)

    # FUNKCJA: Pobieranie rekordu po id
    db_record = get_by_id(waste_record_id, db)

    # FUNKCJA: Parsowanie na float
    mass_kg = parse_float(waste_record.mass_kg) if waste_record.mass_kg is not None else db_record.mass_kg
    price_per_kg = parse_float(waste_record.price_per_kg) if waste_record.price_per_kg is not None else db_record.price_per_kg

   # FUNKCJA: Obliczanie ceny
    db_record.mass_kg = mass_kg
    db_record.price_per_kg = price_per_kg
    db_record.total_price = calculate_total_price(mass_kg, price_per_kg)

    # FUNKCJE: Walidacja i aktualizacja ID kontrahenta
    if waste_record.contractor_id:
        get_or_404(db, Contractor, waste_record.contractor_id, "Kontrahent")
        db_record.contractor_id = waste_record.contractor_id

    if waste_record.user_id:
        get_or_404(db, User, waste_record.user_id, "Użytkownik")
        db_record.user_id = waste_record.user_id

    if waste_record.waste_id:
        get_or_404(db, Waste, waste_record.waste_id, "Odpad")
        db_record.waste_id = waste_record.waste_id

    if waste_record.vehicle_id:
        get_or_404(db, Vehicle, waste_record.vehicle_id, "Pojazd")
        db_record.vehicle_id = waste_record.vehicle_id

    if waste_record.driver_id:
        get_or_404(db, Driver, waste_record.driver_id, "Kierowca")
        db_record.driver_id = waste_record.driver_id

    if waste_record.destination_id:
        get_or_404(db, Destination, waste_record.destination_id, "Destynacja")
        db_record.destination_id = waste_record.destination_id

    if waste_record.transfer_date:
        validate_not_future_date(waste_record.transfer_date)
        db_record.transfer_date = waste_record.transfer_date

    if waste_record.notes is not None:
        db_record.notes = waste_record.notes

    db.commit()
    db.refresh(db_record)
    return db_record

# Funkcja do usunięcia rekordu
def delete_waste_record(waste_record_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(waste_record_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_record = get_by_id(waste_record_id, db)
    
    # Usunięcie rekordu
    db.delete(db_record)
    db.commit()
    return {"message": f"Usunięto rekord z ewidencji o id {waste_record_id}"}