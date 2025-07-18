from fastapi import HTTPException, status
from typing import Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.users import User

# Walidacja czy podajemy poprawną liczbę
def validate_id(user_id: int):
    if user_id < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Podaj dodatnią liczbę"
        )

# Pobieranie użytkownika po id
def get_by_id(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono użytkownika o id {user_id}"
        )
    return user

# Generowanie username do logowania
def generate_unique_username(name: str, surname: str, db: Session, exclude_id: Optional[int] = None) -> str:
    base_username = f"{name[0].lower()}{surname.lower()}"
    username = base_username
    counter = 1

    while True:
        query = db.query(User).filter(User.username == username)
        if exclude_id:
            query = query.filter(User.id != exclude_id)
        if not query.first():
            break
        username = f"{base_username}{counter}"
        counter += 1

    return username

# Walidacja imienia i nazwiska
def validate_name_surname(name: Optional[str], surname: Optional[str]):
    if name is not None:
        if not isinstance(name, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Imię musi być typu string"
            )
        if not name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Imię nie może być puste"
            )
        if any(char.isdigit() for char in name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Imię nie może zawierać cyfr"
            )

    if surname is not None:
        if not isinstance(surname, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nazwisko musi być typu string"
            )
        if not surname.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nazwisko nie może być puste"
            )
        if any(char.isdigit() for char in surname):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nazwisko nie może zawierać cyfr"
            )