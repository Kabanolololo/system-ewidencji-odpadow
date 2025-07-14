from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from models.users import User
from schema.users import UserBase, UserCreate, UserUpdate, UserAdminUpdate, UserOut, UserFilterParams
from utils.hash import hash_password

# Funkcja do pobierania wszystkich users
def get_all_users(filters: UserFilterParams, db: Session):
    query = db.query(User)
    
    # filtrowanie imie/nazwisko/rola
    if filters.name:
        query = query.filter(User.name.ilike(f"%{filters.name}%"))
    elif filters.surname:
        query = query.filter(User.name.ilike(f"%{filters.surname}%"))
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
    # Walidacja czy podajemy poprawną liczbę
    if user_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono użytkownika")
    return user

# Funkcja do stworzenia usera
def create_user(user: UserCreate, db: Session):
    # Walidacja imienia i nazwiska
    if not user.name.isalpha() or not user.surname.isalpha():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Imię i nazwisko powinny zawierać tylko litery"
        )

    # Tworzymy username: pierwsza litera imienia + nazwisko
    base_username = f"{user.name[0].lower()}{user.surname.lower()}"
    username = base_username

    # Jeśli taki username istnieje, dodajemy numer
    counter = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{counter}"
        counter += 1

    # Haszowanie hasła
    hashed_password = hash_password(user.password_hash)

    # Dodanie usera do bazy danych
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
    # Walidacja czy podajemy poprawną liczbę
    if user_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono użytkownika")
    
    # Walidacja imienia i nazwiska jeśli podane
    if user_data.name and not user_data.name.isalpha():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Imię powinno zawierać tylko litery")
    if user_data.surname and not user_data.surname.isalpha():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nazwisko powinno zawierać tylko litery")
    
    # Aktualizacja pól jeśli podane
    if user_data.name:
        db_user.name = user_data.name
    if user_data.surname:
        db_user.surname = user_data.surname
    
    # Rola na sztywno 'user'
    db_user.role = "user"

    # Aktualizacja hasła jeśli podane
    if user_data.password_hash:
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
    # Walidacja czy podajemy poprawną liczbę
    if user_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Sprawdzenie czy istnieje taki użytkownik
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nie znaleziono użytkownika")

    # Walidacja imienia i nazwiska
    if not user.name.isalpha() or not user.surname.isalpha():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Imię i nazwisko powinny zawierać tylko litery"
        )
    
    # Tworzymy username: pierwsza litera imienia + nazwisko
    base_username = f"{user.name[0].lower()}{user.surname.lower()}"
    username = base_username

    # Jeśli taki username istnieje, dodajemy numer
    counter = 1
    while True:
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user is None or existing_user.id == user_id:
            # albo username jest wolny albo należy do aktualizowanego usera
            break
        username = f"{base_username}{counter}"
        counter += 1

    # Haszowanie hasła
    if user.password_hash:
        hashed_password = hash_password(user.password_hash)
        db_user.password_hash = hashed_password

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
    # Walidacja czy podajemy poprawną liczbę
    if user_id < 1:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Podaj dodatnią liczbę")
    
    # Walidacja czy istnieje taki kierowca
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nie znaleziono użytkownika o id {user_id}"
        )
    
    # Usunięcie kierowcy
    db.delete(db_user)
    db.commit()
    return {"message": "Usunięto użytkownika"}