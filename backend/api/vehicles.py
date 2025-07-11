from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
#VehicleBase, VehicleCreate, VehicleUpdate, VehicleOut
#from crud
from api.dependencies import get_db


router = APIRouter()
"""
# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[VehicleBase])
def list_vehicles(db: Session = Depends(get_db)):
    return {"detail": "Not implemented"}

# Endpoint do pobierania pojedynczego elementu
@router.get("/{vehicle_id}", response_model=VehicleBase)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    return {"detail": "Not implemented"}

# Endpoint do tworzenia pojedynczego elementu
@router.post("/", response_model=VehicleCreate)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    return {"detail": "Not implemented"}

# Endpoint do aktualizacji pojedynczego elementu
@router.put("/{vehicle_id}", response_model=VehicleUpdate)
def update_vehicle(vehicle_id: int, vehicle: VehicleUpdate, db: Session = Depends(get_db)):
    return {"detail": "Not implemented"}

# Endpoint do usuwania pojedynczego elementu
@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    return {"detail": "Not implemented"}
"""