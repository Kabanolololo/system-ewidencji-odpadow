from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import List
from sqlalchemy.orm import Session
from schema.waste import WasteBase, WasteCreate, WasteUpdate, WasteOut, WasteFilterParams
from crud.waste import get_all_waste, get_one_waste, created_waste,updated_waste,deleted_waste
from api.dependencies import get_db
from utils.jwt import check_user_or_admin

router = APIRouter()


############################################################################## 
################### Endpointy dla użytkowników zalgowanych ###################
############################################################################## 


# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[WasteOut])
def list_wastes(
        filters: WasteFilterParams = Depends(), 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return get_all_waste(filters=filters, db=db)

# Endpoint do pobierania pojedynczego odpadu
@router.get("/{waste_id}", response_model=WasteBase)
def get_waste(
        waste_id: int, db: 
        Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return get_one_waste(waste_id=waste_id, db=db)

# Endpoint do tworzenia odpadu
@router.post("/", response_model=WasteCreate)
def create_waste(
        waste: WasteCreate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return created_waste(waste=waste, user_id=current_user["user_id"], db=db)

# Endpoint do aktualizacji pojedynczego odpadu
@router.put("/{waste_id}", response_model=WasteUpdate)
def update_waste(
        waste_id: int, 
        waste: WasteUpdate,
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return updated_waste(waste_id=waste_id, waste=waste, db=db)

# Endpoint do usuwania pojedynczego odpadu
@router.delete("/{waste_id}")
def delete_waste(
        waste_id: int, db: 
        Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return deleted_waste(waste_id=waste_id,db=db)