from fastapi import Header, HTTPException, status, Depends
from auth.jwt import verify_token

# Funkcja do sprawdzania czy użytkownik ma rolę 'user' lub 'admin'
def check_user_or_admin(token: str = Header(...)):
    current_user = verify_token(token)
    current_role = current_user.get("role")

    if current_role not in ["user", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Brak uprawnień do wykonania tej operacji")
    return current_user

# Funkcja do sprawdzania czy użytkownik jest adminem
def check_admin(token: str = Header(...)):
    current_user = verify_token(token)
    current_role = current_user.get("role")

    if current_role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Tylko administrator ma uprawinienia do wykonania tej operacji")
    return current_user