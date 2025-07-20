from fastapi import HTTPException, status
from typing import Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.audit_log import AuditLog

# Walidacja czy podajemy poprawną liczbę
def validate_id(log_id: int):
    if log_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie destynacji po id
def get_by_id(log_id: int, db: Session) -> AuditLog:
    log = db.query(AuditLog).filter(AuditLog.id == log_id).first()
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono w dzienniku zdarzeń id {log_id}"
        )
    return log