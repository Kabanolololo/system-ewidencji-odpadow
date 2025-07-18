from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List
from sqlalchemy.orm import Session
from schema.users import UserBase, UserCreate, UserUpdate, UserAdminUpdate, UserOut, UserFilterParams
from crud.users import get_all_users, get_one_user,create_user ,update_user, update_user_admin, delete_user
from api.dependencies import get_db
from utils.jwt import check_user_or_admin, check_admin

router = APIRouter()

############################################################################## 
################### Endpointy dla użytkowników zalgowanych ###################
############################################################################## 


# Endpoint do pobierania pojedynczego elementu
@router.get("/{user_id}", response_model=UserOut)
def get_user(
        user_id: int, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return get_one_user(user_id=user_id, db=db)

# Endpoint do aktualizacji pojedynczego elementu (USER)
@router.put("/{user_id}", response_model=UserOut)
def update_existing_user(
        user_id: int, 
        user_data: UserUpdate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_user_or_admin)
    ):
    return update_user(user_id=user_id, user_data=user_data, db=db)

############################################################################## 
################### Endpointy dla ADMINISTARTOROW ############################
############################################################################## 


# Endpoint do pobierania wszystkich elementów
@router.get("/", response_model=List[UserOut])
def list_users(
        filters: UserFilterParams = Depends(),
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_admin)
    ):
    return get_all_users(filters=filters, db=db)

# Endpoint do tworzenia elementu
@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_new_user(
        user: UserCreate,
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_admin)
    ):
    return create_user(user=user, db=db)

# ADMIN: Endpoint do aktualizacji pojedynczego elementu (ADMIN)
@router.put("/admin/{user_id}", response_model=UserOut)
def update_existing_user_admin(
        user_id: int, 
        user: UserAdminUpdate, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_admin)
    ):
    return update_user_admin(user_id=user_id, user=user, db=db)

# Endpoint do usuwania pojedynczego elementu
@router.delete("/{user_id}")
def delete_existing_user(
        user_id: int, 
        db: Session = Depends(get_db), 
        current_user: dict = Depends(check_admin)
    ):
    return delete_user(user_id=user_id, db=db)