from sqlalchemy.orm import Session
from models import AuditLog
from datetime import datetime

# Serializuje wartości na JSON-friendly format  
def serialize_value(value):
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: serialize_value(v) for k, v in value.items()}
    if isinstance(value, list):
        return [serialize_value(v) for v in value]
    return value

# Serializuje SQLAlchemy obiekt lub słownik  
def serialize_sqlalchemy_obj(obj):
    if obj is None:
        return None
    if isinstance(obj, dict):
        return serialize_value(obj)
    data = obj.__dict__.copy()
    data.pop('_sa_instance_state', None)
    return serialize_value(data)

# Funkcja tworzy i zapisuje log audytu w bazie  
def create_audit_log(db: Session, user_id: int, table_name: str, record_id: int, operation: str, old_data: object = None, new_data: object = None):
    old_data_serialized = serialize_sqlalchemy_obj(old_data)
    new_data_serialized = serialize_sqlalchemy_obj(new_data)
    audit_log = AuditLog(
        user_id=user_id,
        table_name=table_name,
        record_id=record_id,
        operation=operation,
        old_data=old_data_serialized,
        new_data=new_data_serialized,
    )
    try:
        db.add(audit_log)
        db.commit()
    except Exception:
        db.rollback()
        raise