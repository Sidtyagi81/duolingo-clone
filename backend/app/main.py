from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models

from app.routers.lesson import router as lesson_router
from app.routers.course import router as course_router
from app.routers.user import router as user_router
from app.routers.activity import router as activity_router
from app.routers.progress import router as progress_router


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(
    title="Duolingo Clone API",
    description="Backend API for Duolingo Web App",
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(course_router)
app.include_router(lesson_router)
app.include_router(user_router)
app.include_router(progress_router)
app.include_router(activity_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Duolingo Clone API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }