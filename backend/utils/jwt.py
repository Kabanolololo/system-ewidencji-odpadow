from fastapi import Header, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from auth.jwt import verify_token

# mechanizm OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Funkcja do sprawdzania czy użytkownik ma rolę 'user' lub 'admin'
def check_user_or_admin(token: str = Depends(oauth2_scheme)):
    current_user = verify_token(token)
    if current_user.get("role") not in ["user", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Brak uprawnień do wykonania tej operacji"
        )
    return current_user

# Funkcja do sprawdzania czy użytkownik jest adminem
def check_admin(token: str = Depends(oauth2_scheme)):
    current_user = verify_token(token)
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tylko administrator ma uprawnienia do wykonania tej operacji"
        )
    return current_user