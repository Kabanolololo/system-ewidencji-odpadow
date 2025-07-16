from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schema.driver import DriverBase, DriverCreate, DriverUpdate, DriverOut, DriverFilterParams
from crud.driver import get_all_drivers, get_one_driver, created_driver, updated_driver, deleted_driver
from api.dependencies import get_db

router = APIRouter()

# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[DriverOut])
def list_drivers(filters: DriverFilterParams = Depends(), db: Session = Depends(get_db)):
    return get_all_drivers(filters=filters, db=db)

# Endpoint do pobierania pojedynczego elementu
@router.get("/{driver_id}", response_model=DriverOut)
def get_driver(driver_id: int, db: Session = Depends(get_db)):
    return get_one_driver(driver_id=driver_id, db=db)

# Endpoint do tworzenia pojedynczego elementu
@router.post("/", response_model=DriverOut)
def create_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    return created_driver(driver=driver, db=db)

# Endpoint do aktualizacji pojedynczego elementu
@router.put("/{driver_id}", response_model=DriverOut)
def update_driver(driver_id: int, driver: DriverUpdate, db: Session = Depends(get_db)):
    return updated_driver(driver_id=driver_id, driver=driver, db=db)

# Endpoint do usuwania pojedynczego elementu
@router.delete("/{driver_id}")
def delete_driver(driver_id: int, db: Session = Depends(get_db)):
    return deleted_driver(driver_id=driver_id, db=db)
