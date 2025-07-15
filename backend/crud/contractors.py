from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.contractors import Contractor
from schema.contractors import ContractorCreate, ContractorOut, ContractorUpdate,ContractorFilterParams
import re
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
    # Walidacja czy podajemy poprawną liczbę
    if contractor_id < 1:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
        
    # Walidacja czy istnieje taki kierowca
    db_contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()

    if not db_contractor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Nie znaleziono kontrahenta o id {db_contractor}"
            )
            
    return db_contractor

# Funkcja do stworzenia firmy (API VAT)
def created_contractor_online(nip: str, db: Session):
    API_URL = "https://wl-api.mf.gov.pl/api/search/nip"
    
    # Walidacja NIP-u
    if not nip.isnumeric() or len(nip)!=10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Niepoprawny NIP"
        )

    today = datetime.date.today().isoformat()
    url = f"{API_URL}/{nip}?date={today}"

    try:
        with httpx.Client(timeout=10) as client:
            response = client.get(url)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Błąd pobierania danych z API VAT"
        )

    subject = data.get("result", {}).get("subject")
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nie znaleziono danych dla podanego NIP"
        )

    nip_api = subject.get("nip")
    regon = subject.get("regon")
    name = subject.get("name")
    address = subject.get("residenceAddress")

    if not all([nip_api, regon, name, address]):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Brak wymaganych danych w odpowiedzi API"
        )

    # Walidacja czy nip lub regon już istnieją
    existing = db.query(Contractor).filter(Contractor.nip == nip_api).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kontrahent z podanym NIP już istnieje w bazie"
        )

    # Wyczyść i sformatuj adres
    address_clean = address.strip()
    address_clean = re.sub(r'\s+', ' ', address_clean)
    address_clean = re.sub(r'^(u[lL]?\.?\s*)+', '', address_clean, flags=re.IGNORECASE)
    address_clean = f"UL. {address_clean}"

    # Zapisz do bazy
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
   # Walidacja czy nip i regon to liczby
    errors = []
    if not contractor.nip.isnumeric():
        errors.append("NIP musi składać się tylko z cyfr")
    if not contractor.regon.isnumeric():
        errors.append("REGON musi składać się tylko z cyfr")
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors
        )
        
    # Walidacja czy nip lub regon już istnieją
    existing_nip = db.query(Contractor).filter(Contractor.nip == contractor.nip).first()
    existing_regon = db.query(Contractor).filter(Contractor.regon == contractor.regon).first()

    if existing_nip or existing_regon:
        if existing_nip and existing_regon:
            detail = "Kontrahent z podanym NIP i REGON już istnieje."
        elif existing_nip:
            detail = "Kontrahent z podanym NIP już istnieje."
        else:
            detail = "Kontrahent z podanym REGON już istnieje."

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )
    
    # Walidacja i czyszczenie adresu
    validated_address = contractor.address.strip()
    validated_address = re.sub(r'\s+', ' ', validated_address)
    validated_address = re.sub(r'^(u[lL]?\.?\s*)+', '', validated_address, flags=re.IGNORECASE)
    validated_address = f"ul. {validated_address}"

    # Stworzenie nowego kontrahenta
    new_contractor = Contractor(
        nip=contractor.nip,
        regon=contractor.regon,
        name=contractor.name,
        address=validated_address
    )

    db.add(new_contractor)
    db.commit()
    db.refresh(new_contractor)

    return new_contractor

# Funkcja do aktualizacji firmy
def updated_contractor(contractor_id: int, contractor: ContractorUpdate, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if contractor_id < 1:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
        
    # Walidacja czy istnieje taki kierowca
    db_contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()

    if not db_contractor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Nie znaleziono kontrahenta o id {db_contractor}"
            )

    # Walidacja czy nip i regon to liczby
    errors = []
    if not contractor.nip.isnumeric():
        errors.append("NIP musi składać się tylko z cyfr")
    if not contractor.regon.isnumeric():
        errors.append("REGON musi składać się tylko z cyfr")
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors
        )

    # walidacja nip nie może się powtarzać (poza tym obiektem)
    if contractor.nip and contractor.nip != db_contractor.nip:
        existing_nip = db.query(Contractor).filter(Contractor.nip == contractor.nip).first()
        if existing_nip:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inny kontrahent z podanym NIP już istnieje"
            )

    # walidacja regon nie może się powtarzać (poza tym obiektem)
    if contractor.regon and contractor.regon != db_contractor.regon:
        existing_regon = db.query(Contractor).filter(Contractor.regon == contractor.regon).first()
        if existing_regon:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inny kontrahent z podanym REGON już istnieje"
            )

    # Aktualizacja pól
    if contractor.nip:
        db_contractor.nip = contractor.nip
    if contractor.regon:
        db_contractor.regon = contractor.regon
    if contractor.name:
        db_contractor.name = contractor.name

    if contractor.address:
        validated_address = contractor.address.strip()
        validated_address = re.sub(r'\s+', ' ', validated_address)
        validated_address = re.sub(r'^(u[lL]?\.?\s*)+', '', validated_address, flags=re.IGNORECASE)
        validated_address = f"ul. {validated_address}"
        db_contractor.address = validated_address

    db.commit()
    db.refresh(db_contractor)

    return db_contractor

# Funkcja do usunięcia firmy
def deleted_contractor(contractor_id: int, db: Session):
    # Walidacja czy podajemy poprawną liczbę
    if contractor_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki kierowca
    db_contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()

    if not db_contractor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono kontrahenta o id {db_contractor}"
        )
    
    # Usunięcie kierowcy
    db.delete(db_contractor)
    db.commit()
    return {"message": "Usunięto kontrahenta"}