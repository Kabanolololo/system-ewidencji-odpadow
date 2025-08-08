from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from api.dependencies import get_db
from crud.reports import get_waste_mass_by_month, get_available_years, get_pickup_counts_by_month, get_average_revenue_by_waste, get_revenue_by_month, get_total_revenue_by_month
from schema.reports import WasteMassByMonth, YearsResponse, WastePickupCount, WasteAverageRevenue, WasteRevenueByMonth, TotalRevenueByMonth, FilterParameters
from typing import List
from utils.jwt import check_user_or_admin    

router = APIRouter()

############################################################################## 
################### Endpointy dla użytkowników zalgowanych ###################
############################################################################## 

# Endpointy wyświetlający lata
@router.get("/years", response_model=YearsResponse)
def get_years(
    db: Session = Depends(get_db), 
    current_user: dict = Depends(check_user_or_admin)
    ):
    years = get_available_years(db)
    return {"years": years}

# Endpointy wyświetlający masę odpadów według miesiąca
@router.get("/waste-mass", response_model=List[WasteMassByMonth])
def waste_mass_report(
    filters: FilterParameters = Depends(),
    db: Session = Depends(get_db), 
    current_user: dict = Depends(check_user_or_admin)
):
    data = get_waste_mass_by_month(
        db, 
        year=filters.year, 
        month_from=filters.month_from, 
        month_to=filters.month_to
    )
    return data

# Endpointy wyświetlający liczbę odbiorów odpadów według miesiąca
@router.get("/pickup-counts", response_model=List[WastePickupCount])
def pickup_counts(
    filters: FilterParameters = Depends(),
    db: Session = Depends(get_db), 
    current_user: dict = Depends(check_user_or_admin)
):
    return get_pickup_counts_by_month(db, filters.year, filters.month_from, filters.month_to)

# Endpointy wyświetlający średnie przychody według miesiąca
@router.get("/average-revenue", response_model=List[WasteAverageRevenue])
def average_revenue(
    filters: FilterParameters = Depends(),
    db: Session = Depends(get_db), 
    current_user: dict = Depends(check_user_or_admin)
):
    return get_average_revenue_by_waste(db, filters.year, filters.month_from, filters.month_to)

# Endpointy wyświetlający przychody według miesiąca
@router.get("/revenue-by-month", response_model=List[WasteRevenueByMonth])
def revenue_by_month(
    filters: FilterParameters = Depends(),
    db: Session = Depends(get_db), 
    current_user: dict = Depends(check_user_or_admin)
):
    return get_revenue_by_month(db, filters.year, filters.month_from, filters.month_to)

# Endpointy wyświetlający całkowite przychody według miesiąca
@router.get("/total-revenue-by-month", response_model=List[TotalRevenueByMonth])
def total_revenue_by_month(
    filters: FilterParameters = Depends(),
    db: Session = Depends(get_db), 
    current_user: dict = Depends(check_user_or_admin)
):
    return get_total_revenue_by_month(db, filters.year, filters.month_from, filters.month_to)