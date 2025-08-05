from pydantic import BaseModel

# Schemat do logowania
class LoginRequest(BaseModel):
    username: str
    password: str

# Schemat do zwracania informacji
class LoginResponse(BaseModel):
    access_token: str
    token_type: str

