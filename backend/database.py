from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Disney2002.@localhost:5432/waste_records")

# Tworzenie silnika połączenia z bazą danych
engine = create_engine(DATABASE_URL)

# Tworzenie sesji
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Bazowy model dla SQLAlchemy
Base = declarative_base()

# Tworzenie tabel w bazie danych, jeśli nie istnieją
Base.metadata.create_all(bind=engine)
