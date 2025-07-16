from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.users import User
from schema.users import UserBase, UserCreate, UserUpdate, UserAdminUpdate, UserOut, UserFilterParams
from utils.users import validate_id, get_by_id, generate_unique_username
from utils.driver import validate_name_surname
from utils.hash import hash_password

# Funkcja do pobierania wszystkich users
def get_all_users(filters: UserFilterParams, db: Session):
    query = db.query(User)
    
    # filtrowanie imie/nazwisko/rola
    if filters.name:
        query = query.filter(User.name.ilike(f"%{filters.name}%"))
    elif filters.surname:
        query = query.filter(User.surname.ilike(f"%{filters.surname}%"))
    elif filters.role:
        if filters.role == "user":
            query = query.filter(User.role.ilike("user"))
        elif filters.role == "admin":
            query = query.filter(User.role.ilike("admin"))
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Podaj poprawną wartość admin/user")
    
    # Sortowanie wybor czy imie/nazwisko
    if filters.sort_by:
        if filters.sort_by == "name":
            column = User.name
        elif filters.sort_by == "surname":
            column = User.surname
        elif filters.sort_by == "role":
            column = User.role
        else:
            raise HTTPException(status_code=400, detail="Nieprawidłowe pole sortowania")
        
        # Sortowanie asc/desc
        if filters.sort_order == "desc":
            column = column.desc()
        else:
            column = column.asc()

        query = query.order_by(column)
    
    users = query.all()
    
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brak użytkowników w systemie"
        )

    return users

# Funckja do pobrania konkretnego usera
def get_one_user(user_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(user_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_user = get_by_id(user_id, db)
    return db_user

# Funkcja do stworzenia usera
def create_user(user: UserCreate, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_name_surname(user.name, user.surname)

    # FUNKCJA: Generowanie username do logowania
    username = generate_unique_username(user.name, user.surname, db)

    # FUNKCJA: Haszowanie hasła
    hashed_password = hash_password(user.password_hash)

    db_user = User(
        name=user.name,
        surname=user.surname,
        username=username,
        password_hash=hashed_password,
        role="user"
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Błąd integralności danych podczas tworzenia użytkownika"
        )
        
# Funkcja do aktualizacji usera
def update_user(user_id: int, user_data: UserUpdate, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(user_id)

    # FUNKCJA: Pobieranie użytkownika po id
    db_user = get_by_id(user_id, db)

    if user_data.name or user_data.surname:
        # FUNKCJA: Walidacja imienia i nazwiska czy sa stringami
        validate_name_surname(user_data.name or db_user.name, user_data.surname or db_user.surname)

    if user_data.name:
        db_user.name = user_data.name
    if user_data.surname:
        db_user.surname = user_data.surname

    db_user.role = "user"

    if user_data.password_hash:
        # FUNKCJA: Haszowanie hasła
        db_user.password_hash = hash_password(user_data.password_hash)

    try:
        db.commit()
        db.refresh(db_user)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Wystąpił błąd podczas aktualizacji użytkownika"
        )

    return db_user

# Funkcja do aktualizacji usera ADMIN
def update_user_admin(user_id: int, user: UserAdminUpdate, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(user_id)

    # FUNKCJA: Pobieranie użytkownika po id
    db_user = get_by_id(user_id, db)

    # FUNKCJA: Walidacja imienia i nazwiska czy sa stringami
    validate_name_surname(user.name, user.surname)

    # FUNKCJA: Generowanie username do logowania
    username = generate_unique_username(user.name, user.surname, db, exclude_id=user_id)

    if user.password_hash:
        # FUNKCJA: Haszowanie hasła
        db_user.password_hash = hash_password(user.password_hash)

    # Aktualizacja pól
    db_user.name = user.name
    db_user.surname = user.surname
    db_user.username = username
    db_user.role = user.role

    try:
        db.commit()
        db.refresh(db_user)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Wystąpił błąd podczas aktualizacji użytkownika"
        )

    return db_user

# Funkcja do usunięcia users
def delete_user(user_id: int, db: Session):
    # FUNKCJA: Walidacja czy podajemy poprawną liczbę
    validate_id(user_id)
    
    # FUNKCJA: Pobieranie destynacji po id
    db_user = get_by_id(user_id, db)
    
    # Usunięcie kierowcy
    db.delete(db_user)
    db.commit()
    return {"message": f"Usunięto użytkownika o id {user_id}"}