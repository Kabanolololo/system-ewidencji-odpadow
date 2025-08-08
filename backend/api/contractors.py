from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List
from schema.contractors import ContractorCreate, ContractorOut, ContractorUpdate,ContractorOnlineCreate,ContractorFilterParams
from crud.contractors import get_all_contractors,get_one_contractor,created_contractor_online, created_contractor_offline,updated_contractor, deleted_contractor
from api.dependencies import get_db
from utils.jwt import check_user_or_admin

router = APIRouter()

############################################################################## 
################### Endpointy dla użytkowników zalgowanych ###################
############################################################################## 

# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=list[ContractorOut])
def list_contractors(
        filters: ContractorFilterParams = Depends(), 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return get_all_contractors(filters=filters, db=db)

# Endpoint do pobierania pojedynczego elementu
@router.get("/{contractor_id}", response_model=ContractorOut)
def get_contractor(
        contractor_id: int, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return get_one_contractor(contractor_id=contractor_id, db=db)

# Endpoint do tworzenia pojedynczego elementu (API VAT)
@router.post("/create/online", response_model=ContractorOut)
def create_contractor_online(
        contractor: ContractorOnlineCreate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return created_contractor_online(nip=contractor.nip, user_id=current_user["user_id"], db=db)

# Endpoint do tworzenia pojedynczego elementu (OFFLINE)
@router.post("/create/offline", response_model=ContractorOut)
def create_contractor_offline(
        contractor: ContractorCreate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return created_contractor_offline(contractor=contractor, user_id=current_user["user_id"], db=db)

# Endpoint do aktualizacji pojedynczego elementu
@router.put("/{contractor_id}", response_model=ContractorOut)
def update_contractor(
        contractor_id: int, 
        contractor: ContractorUpdate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return updated_contractor(contractor_id=contractor_id, contractor=contractor, user_id=current_user["user_id"], db=db)

# Endpoint do usuwania pojedynczego elementu
@router.delete("/{contractor_id}")
def delete_contractor(
        contractor_id: int, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return deleted_contractor(contractor_id=contractor_id, user_id=current_user["user_id"], db=db)