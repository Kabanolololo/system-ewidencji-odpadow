from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schema.vehicles import VehicleBase, VehicleCreate, VehicleUpdate, VechicleOut, VehicleFilterParams
from crud.vehicles import get_all_cars, get_one_car, created_car, updated_car,deleted_car
from api.dependencies import get_db

router = APIRouter()

# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[VechicleOut])
def list_vehicles(filters: VehicleFilterParams = Depends(),db: Session = Depends(get_db)):
    return get_all_cars(filters=filters, db=db)

# Endpoint do pobierania pojedynczego elementu
@router.get("/{vehicle_id}", response_model=VehicleBase)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    return get_one_car(car_id=vehicle_id, db=db)

# Endpoint do tworzenia pojedynczego elementu
@router.post("/", response_model=VehicleCreate)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    return created_car(car=vehicle, db=db)

# Endpoint do aktualizacji pojedynczego elementu
@router.put("/{vehicle_id}", response_model=VehicleUpdate)
def update_vehicle(vehicle_id: int, vehicle: VehicleUpdate, db: Session = Depends(get_db)):
    return updated_car(car_id=vehicle_id, car=vehicle, db=db)

# Endpoint do usuwania pojedynczego elementu
@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    return deleted_car(car_id=vehicle_id, db=db)