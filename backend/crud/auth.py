from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import User
from schema.auth import LoginRequest, LoginResponse
from auth.hash import verify_password
from auth.jwt import create_access_token

# Funkcja pobierajaca username 
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

# Funkcja autentykująca użytkownika
def authenticate_user(db: Session, username: str, password: str) -> str:
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Nieprawidłowy login lub hasło")

    token_data = {"user_id": user.id, "role": user.role}
    access_token = create_access_token(token_data)
    return access_token
