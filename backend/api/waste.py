from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import List
from sqlalchemy.orm import Session
from schema.waste import WasteBase, WasteCreate, WasteUpdate, WasteOut
from crud.waste import get_all_waste, get_one_waste, created_waste,updated_waste,deleted_waste
from api.dependencies import get_db

router = APIRouter()

# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[WasteBase])
def list_wastes(db: Session = Depends(get_db)):
    return get_all_waste(db=db)

# Endpoint do pobierania pojedynczego odpadu
@router.get("/{waste_id}", response_model=WasteBase)
def get_waste(waste_id: int, db: Session = Depends(get_db)):
    return get_one_waste(waste_id=waste_id, db=db)

# Endpoint do tworzenia odpadu
@router.post("/", response_model=WasteCreate)
def create_waste(waste: WasteCreate, db: Session = Depends(get_db)):
    return created_waste(waste=waste, db=db)

# Endpoint do aktualizacji pojedynczego odpadu
@router.put("/{waste_id}", response_model=WasteUpdate)
def update_waste(waste_id: int, waste: WasteUpdate, db: Session = Depends(get_db)):
    return updated_waste(waste_id=waste_id, waste=waste, db=db)

# Endpoint do usuwania pojedynczego odpadu
@router.delete("/{waste_id}")
def delete_waste(waste_id: int, db: Session = Depends(get_db)):
    return deleted_waste(waste_id=waste_id,db=db)