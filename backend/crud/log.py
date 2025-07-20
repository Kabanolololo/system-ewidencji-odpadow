from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.audit_log import AuditLog
#from schema.contractors import ContractorCreate, ContractorOut, ContractorUpdate,ContractorFilterParams
from utils.contractors import validate_id, get_by_id

# Funkcja do pobierania wszystkich firm wraz z filtrowaniem
def get_all_logs(db: Session):
    query = db.query(AuditLog)
    return query

# Funckja do pobrania konkretnego firmy
def get_one_log(log_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(log_id)
    
    # FUNKCJA: Pobieranie kontrahenta po id
    db_log = get_by_id(log_id, db)
    return db_log