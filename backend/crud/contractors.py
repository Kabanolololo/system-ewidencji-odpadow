from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.contractors import Contractor
from schema.contractors import ContractorCreate, ContractorOut, ContractorUpdate,ContractorFilterParams
from utils.contractors import clean_address, validate_id, get_by_id,validate_nip_regon, check_unique
import datetime
import httpx

# Funkcja do pobierania wszystkich firm wraz z filtrowaniem
def get_all_contractors(filters: ContractorFilterParams, db: Session):
    query = db.query(Contractor)
    
    # Filtrowanie po nip/regon/nazwa
    if filters.nip:
        query = query.filter(Contractor.nip.ilike(f"%{filters.nip}%"))
    if filters.regon:
        query = query.filter(Contractor.regon.ilike(f"%{filters.regon}%"))
    if filters.name:
        query = query.filter(Contractor.name.ilike(f"%{filters.name}%"))
    
    # Sortowanie wybor nip/regon/nazwa
    if filters.sort_by:
        if filters.sort_by == "nip":
            column = Contractor.nip
        elif filters.sort_by == "regon":
            column = Contractor.regon
        elif filters.sort_by == "name":
            column = Contractor.name
        else:
            raise HTTPException(status_code=400, detail="Nieprawidłowe pole sortowania")

        # Sortowanie asc/desc
        if filters.sort_order == "desc":
            column = column.desc()
        else:
            column = column.asc()

        query = query.order_by(column)

    contractors = query.all()

    if not contractors:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brak kontrahentów w systemie"
        )

    return contractors

# Funckja do pobrania konkretnego firmy
def get_one_contractor(contractor_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(contractor_id)
    
    # FUNKCJA: Pobieranie kontrahenta po id
    db_contractor = get_by_id(contractor_id, db)
    return db_contractor

# Funkcja do stworzenia firmy (API VAT)
def created_contractor_online(nip: str, db: Session):
    API_URL = "https://wl-api.mf.gov.pl/api/search/nip"
    
    # FUNKCJA: Walidacja nipu
    validate_nip_regon(nip=nip, regon=None)

    today = datetime.date.today().isoformat()
    url = f"{API_URL}/{nip}?date={today}"

    try:
        with httpx.Client(timeout=10) as client:
            response = client.get(url)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Błąd pobierania danych z API VAT"
        )

    subject = data.get("result", {}).get("subject")
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=F"Nie znaleziono danych dla podanego NIP {nip}"
        )

    nip_api = subject.get("nip")
    regon = subject.get("regon")
    name = subject.get("name")
    address = subject.get("residenceAddress")
    
    if not address:
        address = "-"

    if not all([nip_api, regon, name, address]):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Brak wymaganych danych w odpowiedzi API"
        )

    # FUNKCJA: Sprawdzenie unikalności nipu
    check_unique(db=db, nip=nip_api, regon=None)

    # FUNKCJA: Czyszczenie adresu
    address_clean = clean_address(address)

    new_contractor = Contractor(
        nip=nip_api,
        regon=regon,
        name=name,
        address=address_clean
    )
    db.add(new_contractor)
    db.commit()
    db.refresh(new_contractor)

    return new_contractor

# Funkcja do stworzenia firmy (OFFLINE)
def created_contractor_offline(contractor: ContractorCreate, db: Session):
    # FUNKCA: Walidacja nip i regon
    validate_nip_regon(nip=contractor.nip, regon=contractor.regon)

    # FUNKCJA: Sprawdzenie unikalności nipu i regon
    try:
        check_unique(db=db, nip=contractor.nip, regon=contractor.regon)
    except HTTPException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.detail
        )

    # FUNKCJA: Czyszczenie adresu
    address_clean = clean_address(contractor.address)

    # Tworzenie nowego kontrahenta
    new_contractor = Contractor(
        nip=contractor.nip,
        regon=contractor.regon,
        name=contractor.name,
        address=address_clean
    )

    db.add(new_contractor)
    db.commit()
    db.refresh(new_contractor)

    return new_contractor

# Funkcja do aktualizacji firmy
def updated_contractor(contractor_id: int, contractor: ContractorUpdate, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(contractor_id)

    # FUNKCJA: Pobranie kontrahenta po id
    db_contractor = get_by_id(contractor_id, db)

    # FUNKCJA: Walidacja nip i regon
    validate_nip_regon(nip=contractor.nip, regon=contractor.regon)

    # FUNKCJA: Sprawdzenie unikalności nip i regon (poza aktualizowanym obiektem)
    if contractor.nip and contractor.nip != db_contractor.nip:
        check_unique(db=db, nip=contractor.nip, regon=None, exclude_id=contractor_id)

    if contractor.regon and contractor.regon != db_contractor.regon:
        check_unique(db=db, nip=None, regon=contractor.regon, exclude_id=contractor_id)

    # Aktualizacja pól
    if contractor.nip:
        db_contractor.nip = contractor.nip
    if contractor.regon:
        db_contractor.regon = contractor.regon
    if contractor.name:
        db_contractor.name = contractor.name
    if contractor.address:
        
        # FUNKCJA: Czyszczenie adresu
        db_contractor.address = clean_address(contractor.address)

    db.commit()
    db.refresh(db_contractor)

    return db_contractor

# Funkcja do usunięcia firmy
def deleted_contractor(contractor_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(contractor_id)

    # FUNKCJA: Pobranie kontrahenta po id (lub wyjątek jeśli nie istnieje)
    db_contractor = get_by_id(contractor_id, db)

    # Usunięcie kontrahenta
    db.delete(db_contractor)
    db.commit()
    return {"message": f"Usunięto kontrahenta o id {contractor_id}"}