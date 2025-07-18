from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List
from sqlalchemy.orm import Session
from schema.destinations import DestinationBase, DestinationCreate, DestinationUpdate, DestinationOut,DestinationFilterParams
from crud.destinations import get_all_destinations, get_one_destination, create_destination, update_destination, delete_destination
from api.dependencies import get_db
from utils.jwt import check_user_or_admin

router = APIRouter()


############################################################################## 
################### Endpointy dla użytkowników zalgowanych ###################
############################################################################## 


# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[DestinationOut])
def list_destinations(
        filters: DestinationFilterParams = Depends(), 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return get_all_destinations(filters=filters, db=db)

# Endpoint do pobierania pojedynczego elementu
@router.get("/{destination_id}", response_model=DestinationOut)
def get_destination(
        destination_id: int, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return get_one_destination(destination_id=destination_id, db=db)

# Endpoint do tworzenia elementu
@router.post("/", response_model=DestinationOut, status_code=status.HTTP_201_CREATED)
def create_new_destination(
        destination: DestinationCreate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return create_destination(destination=destination, db=db)

# Endpoint do aktualizacji pojedynczego elementu
@router.put("/{destination_id}", response_model=DestinationOut)
def update_existing_destination(
        destination_id: int, 
        destination: DestinationUpdate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return update_destination(destination_id=destination_id, destination=destination, db=db)

# Endpoint do usuwania pojedynczego elementu
@router.delete("/{destination_id}")
def delete_existing_destination(
        destination_id: int, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return delete_destination(destination_id=destination_id, db=db)