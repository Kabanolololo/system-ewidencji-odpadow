from sqlalchemy import func, extract
from collections import defaultdict
from sqlalchemy.orm import Session
from models.waste_records import WasteRecord
from models.waste import Waste
from utils.reports import validate_month_range

# Funkcja do pobierania dostępnych lat
def get_available_years(db: Session) -> list[int]:
    results = (
        db.query(extract('year', WasteRecord.transfer_date).label('year'))
        .distinct()
        .order_by('year')
        .all()
    )
    years = [int(row.year) for row in results]
    return years

# Funkcje do pobierania masy odpadów według miesiąca
def get_waste_mass_by_month(db: Session, year: int, month_from: int = 1, month_to: int = 12):
    validate_month_range(month_from, month_to)
    results = (
        db.query(
            func.to_char(WasteRecord.transfer_date, 'YYYY-MM').label('month'),
            Waste.name.label('waste_name'),
            func.sum(WasteRecord.mass_kg).label('total_mass')
        )
        .join(Waste, WasteRecord.waste_id == Waste.id)
        .filter(
            extract('year', WasteRecord.transfer_date) == year,
            extract('month', WasteRecord.transfer_date) >= month_from,
            extract('month', WasteRecord.transfer_date) <= month_to,
        )
        .group_by('month', 'waste_name')
        .order_by('month')
        .all()
    )

    data = defaultdict(lambda: defaultdict(float))
    for month, waste_name, total_mass in results:
        data[month][waste_name] = total_mass

    response = []
    for month, waste_masses in data.items():
        response.append({
            "month": month,
            "waste_masses": dict(waste_masses)
        })
    return response

# Funkcje do pobierania liczby odbiorów odpadów według miesiąca
def get_pickup_counts_by_month(
    db: Session,
    year: int,
    month_from: int = 1,
    month_to: int = 12
):
    validate_month_range(month_from, month_to)
    query = (
        db.query(
            func.to_char(WasteRecord.transfer_date, 'YYYY-MM').label('month'),
            Waste.name.label('waste_name'),
            func.count(WasteRecord.id).label('pickups_count')
        )
        .join(Waste, WasteRecord.waste_id == Waste.id)
        .filter(
            extract('year', WasteRecord.transfer_date) == year,
            extract('month', WasteRecord.transfer_date) >= month_from,
            extract('month', WasteRecord.transfer_date) <= month_to
        )
        .group_by('month', 'waste_name')
        .order_by('month')
    )

    results = query.all()

    return [
        {"month": row.month, "waste_name": row.waste_name, "pickups_count": row.pickups_count}
        for row in results
    ]

# Funkcje do pobierania średnich przychodów według miesiąca
def get_average_revenue_by_waste(
    db: Session,
    year: int,
    month_from: int = 1,
    month_to: int = 12
):
    validate_month_range(month_from, month_to)
    query = (
        db.query(
            func.to_char(WasteRecord.transfer_date, 'YYYY-MM').label('month'),
            Waste.name.label('waste_name'),
            func.avg(WasteRecord.total_price).label('average_revenue')
        )
        .join(Waste, WasteRecord.waste_id == Waste.id)
        .filter(
            extract('year', WasteRecord.transfer_date) == year,
            extract('month', WasteRecord.transfer_date) >= month_from,
            extract('month', WasteRecord.transfer_date) <= month_to
        )
        .group_by('month', 'waste_name')
        .order_by('month')
    )

    results = query.all()

    return [
        {
            "month": row.month,
            "waste_name": row.waste_name,
            "average_revenue": float(row.average_revenue)
        }
        for row in results
    ]

# Funkcje do pobierania przychodów według miesiąca
def get_revenue_by_month(
    db: Session,
    year: int,
    month_from: int = 1,
    month_to: int = 12
):
    validate_month_range(month_from, month_to)
    query = (
        db.query(
            func.to_char(WasteRecord.transfer_date, 'YYYY-MM').label('month'),
            Waste.name.label('waste_name'),
            func.avg(WasteRecord.total_price).label('average_revenue'),
            func.sum(WasteRecord.total_price).label('total_revenue')
        )
        .join(Waste, WasteRecord.waste_id == Waste.id)
        .filter(
            extract('year', WasteRecord.transfer_date) == year,
            extract('month', WasteRecord.transfer_date) >= month_from,
            extract('month', WasteRecord.transfer_date) <= month_to
        )
        .group_by('month', 'waste_name')
        .order_by('month')
    )

    results = query.all()

    return [
        {
            "month": row.month,
            "waste_name": row.waste_name,
            "average_revenue": float(row.average_revenue),
            "total_revenue": float(row.total_revenue)
        }
        for row in results
    ]
    
# Funkcja do pobierania całkowitych przychodów według miesiąca
def get_total_revenue_by_month(
    db: Session,
    year: int,
    month_from: int = 1,
    month_to: int = 12
):
    validate_month_range(month_from, month_to)
    query = (
        db.query(
            func.to_char(WasteRecord.transfer_date, 'YYYY-MM').label('month'),
            func.sum(WasteRecord.total_price).label('total_revenue')
        )
        .filter(
            extract('year', WasteRecord.transfer_date) == year,
            extract('month', WasteRecord.transfer_date) >= month_from,
            extract('month', WasteRecord.transfer_date) <= month_to
        )
        .group_by('month')
        .order_by('month')
    )

    results = query.all()

    return [
        {
            "month": row.month,
            "total_revenue": float(row.total_revenue)
        }
        for row in results
    ]