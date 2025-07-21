from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError
from models.audit_log import AuditLog
from schema.log import AuditLogOut, AuditLogParams
from utils.contractors import validate_id, get_by_id

# Funkcja do pobierania wszystkich firm wraz z filtrowaniem
def get_all_logs(filters: AuditLogParams, db: Session):
    query = db.query(AuditLog)
    
     # Filtrowanie po nazwie tabeli/operacji
    if filters.table_name:
        query = query.filter(AuditLog.table_name == filters.table_name)
    if filters.operation:
        query = query.filter(AuditLog.operation == filters.operation)
    
    # Sortowanie: table_name / operation / created_at
    if filters.sort_by:
        if filters.sort_by == "table_name":
            column = AuditLog.table_name
        elif filters.sort_by == "operation":
            column = AuditLog.operation
        elif filters.sort_by == "created_at":
            column = AuditLog.created_at
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nieprawidłowe pole sortowania"
            )

        if filters.sort_order == "desc":
            column = column.desc()
        else:
            column = column.asc()

        query = query.order_by(column)

    logs = query.all()

    if not logs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brak logów spełniających kryteria"
        )

    return logs

# Funckja do pobrania konkretnego firmy
def get_one_log(log_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(log_id)
    
    # FUNKCJA: Pobieranie kontrahenta po id
    db_log = get_by_id(log_id, db)
    return db_log