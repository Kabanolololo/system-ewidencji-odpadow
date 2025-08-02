from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from api.waste import router as waste_router
from api.driver import router as driver_router
from api.vehicles import router as vehicle_router
from api.destinations import router as destinations_router
from api.users import router as users_router
from api.contractors import router as contractors_router
from api.waste_records import router as wasterecords_router
from api.auth import router as auth_router
from api.log import router as log_router
from api.reports import router as reports_router
from database import SessionLocal, engine, Base
import models

# Tworzymy tabele w bazie danych
Base.metadata.create_all(bind=engine)

# Tworzymy aplikację FastAPI
app = FastAPI(
    title="Waste Records API",
    description="API for managing waste records, enabling CRUD operations for items, categories, and disposal tracking.",
    version="1.0.0",
    contact={
        "name": "Paweł Muszyński",
        "email": "dsw48770@student.dsw.edu.pl"
    }
)

# Dodajemy middleware CORS
origins = [
    "http://localhost:8081",  
    "http://127.0.0.1:8081",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://192.168.0.33:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Routers dla zapytań API
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(reports_router, prefix="/reports", tags=["reports"])
app.include_router(log_router, prefix="/log", tags=["log"])
app.include_router(wasterecords_router, prefix="/records", tags=["records"])
app.include_router(contractors_router, prefix="/contractors", tags=["contractors"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(destinations_router, prefix="/destination", tags=["destination"])
app.include_router(vehicle_router, prefix="/vehicle", tags=["vehicle"])
app.include_router(driver_router, prefix="/driver", tags=["driver"])
app.include_router(waste_router, prefix="/waste", tags=["waste"])