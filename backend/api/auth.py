from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schema.auth import LoginRequest, LoginResponse
from crud.auth import authenticate_user
from api.dependencies import get_db
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

# Endpoint służacy do logowania
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    access_token, user_id, role = authenticate_user(db, form_data.username, form_data.password)
    return {"access_token": access_token, "token_type": "bearer", "user_id": user_id, "role": role}