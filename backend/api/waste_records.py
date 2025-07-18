from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List
from sqlalchemy.orm import Session
from schema.waste_records import WasteRecordBase, WasteRecordCreate, WasteRecordFilterParams, WasteRecordOut, WasteRecordUpdate
from crud.waste_records import get_all_waste_records, get_one_waste_record, create_waste_record, update_waste_record, delete_waste_record
from api.dependencies import get_db
from auth.jwt import verify_token

router = APIRouter()

# Endpoint do pobierania wszystkich rekordów
@router.get("/", response_model=List[WasteRecordOut])
def list_waste_records(
        filters: WasteRecordFilterParams = Depends(), 
        db: Session = Depends(get_db), 
        token: str = Header(...)
    ):
    
    # Funkcja do weryfikacji tokenu
    verify_token(token)
    return get_all_waste_records(filters=filters, db=db)

# Endpoint do pobierania pojedynczego rekordu
@router.get("/{waste_record_id}", response_model=WasteRecordOut)
def get_waste_record(
        waste_record_id: int, 
        db: Session = Depends(get_db), 
        token: str = Header(...)
    ):
    
    # Funkcja do weryfikacji tokenu
    verify_token(token)
    return get_one_waste_record(waste_record_id=waste_record_id, db=db)

# Endpoint do tworzenia nowego rekordu
@router.post("/", response_model=WasteRecordOut)
def create_new_waste_record(
        waste_record: WasteRecordCreate, 
        db: Session = Depends(get_db), 
        token: str = Header(...)
    ):
    
    # Funkcja do weryfikacji tokenu
    verify_token(token)
    return create_waste_record(waste_record=waste_record, db=db)

# Endpoint do aktualizacji rekordu
@router.put("/{waste_record_id}", response_model=WasteRecordOut)
def update_existing_waste_record(
        waste_record_id: int, 
        waste_record: WasteRecordUpdate, 
        db: Session = Depends(get_db), 
        token: str = Header(...)
    ):
    
    # Funkcja do weryfikacji tokenu
    verify_token(token)
    return update_waste_record(waste_record_id=waste_record_id, waste_record=waste_record, db=db)

# Endpoint do usuwania rekordu
@router.delete("/{waste_record_id}")
def delete_existing_waste_record(
        waste_record_id: int, 
        db: Session = Depends(get_db), 
        token: str = Header(...)
    ):
    
    # Funkcja do weryfikacji tokenu
    verify_token(token)
    return delete_waste_record(waste_record_id=waste_record_id, db=db)
