from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List
from sqlalchemy.orm import Session
from schema.log import AuditLogOut, AuditLogParams
from crud.log import get_one_log, get_all_logs
from api.dependencies import get_db
from utils.jwt import check_user_or_admin, check_admin

router = APIRouter()

############################################################################## 
################### Endpointy dla ADMINISTARTOROW ############################
############################################################################## 

# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[AuditLogOut])
def list_logs(
        filters: AuditLogParams = Depends(),
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_admin)
    ):
    return get_all_logs(filters=filters, db=db)

# Endpoint do pobierania pojedynczego elementu
@router.get("/{log_id}", response_model=AuditLogOut)
def get_log(
        log_id: int, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_admin)
    ):
    return get_one_log(log_id=log_id, db=db)