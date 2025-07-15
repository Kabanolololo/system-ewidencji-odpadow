from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.waste_records import WasteRecord
from schema.waste_records import WasteRecordBase, WasteRecordCreate, WasteRecordFilterParams, WasteRecordOut, WasteRecordUpdate

# Funkcja do pobierania wszystkich rekordów wraz z filtrowaniem
def get_all_waste_records():
    pass

# Funckja do pobrania konkretnego rekordu
def get_one_waste_record():
    pass

# Funkcja do stworzenia rekordu
def create_waste_record():
    pass

# Funkcja do aktualizacji rekordu
def update_waste_record():
    pass

# Funkcja do usunięcia rekordu
def delete_waste_record():
    pass