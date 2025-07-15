from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from schema.waste_records import WasteRecordBase, WasteRecordCreate, WasteRecordFilterParams, WasteRecordOut, WasteRecordUpdate
#from crud.destinations import get_all_destinations, get_one_destination, create_destination, update_destination, delete_destination
from api.dependencies import get_db

router = APIRouter()

# Endpoint do pobierania wszystkich rekordów
@router.get("/", response_model=List[WasteRecordOut])
def list_waste_records(db: Session = Depends(get_db)):
    return get_all_waste_records(db=db)

# Endpoint do pobierania pojedynczego rekordu
@router.get("/{waste_record_id}", response_model=WasteRecordOut)
def get_waste_record(waste_record_id: int, db: Session = Depends(get_db)):
    return get_one_waste_record(waste_record_id=waste_record_id, db=db)

# Endpoint do tworzenia nowego rekordu
@router.post("/", response_model=WasteRecordOut)
def create_new_waste_record(waste_record: WasteRecordCreate, db: Session = Depends(get_db)):
    return create_waste_record(waste_record=waste_record, db=db)

# Endpoint do aktualizacji rekordu
@router.put("/{waste_record_id}", response_model=WasteRecordOut)
def update_existing_waste_record(waste_record_id: int, waste_record: WasteRecordUpdate, db: Session = Depends(get_db)):
    return update_waste_record(waste_record_id=waste_record_id, waste_record=waste_record, db=db)

# Endpoint do usuwania rekordu
@router.delete("/{waste_record_id}")
def delete_existing_waste_record(waste_record_id: int, db: Session = Depends(get_db)):
    return delete_waste_record(waste_record_id=waste_record_id, db=db)
