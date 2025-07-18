from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funkcja do haszowania
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Funkcja do odhaszowania
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
