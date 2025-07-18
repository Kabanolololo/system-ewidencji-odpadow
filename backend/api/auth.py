from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schema.auth import LoginRequest, LoginResponse
from crud.auth import authenticate_user
from api.dependencies import get_db

router = APIRouter()

# Endpoint służacy do logowania
@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    access_token = authenticate_user(db, request.username, request.password)
    return {"access_token": access_token, "token_type": "bearer"}