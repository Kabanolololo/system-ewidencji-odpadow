from sqlalchemy import Column, Integer, ForeignKey, String, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Tabela do logowania zmian
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    table_name = Column(String, nullable=False)
    record_id = Column(Integer, nullable=False)
    operation = Column(String, nullable=False)
    old_data = Column(JSON, nullable=True)
    new_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relacja 1:n  Auditlog -> User
    user = relationship("User", back_populates="audit_logs")
