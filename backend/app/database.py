from pathlib import Path
import shutil
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# =========================================================
# PATHS
# =========================================================

# Original database shipped with the project
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DB = PROJECT_ROOT / "duolingo.db"

# Vercel allows writing inside /tmp
RUNTIME_DB = Path("/tmp/duolingo.db")


# =========================================================
# COPY DATABASE TO WRITABLE STORAGE
# =========================================================

if not RUNTIME_DB.exists():
    if SOURCE_DB.exists():
        shutil.copy2(SOURCE_DB, RUNTIME_DB)
    else:
        # If the database does not exist, SQLite will create it
        RUNTIME_DB.touch()


# =========================================================
# DATABASE URL
# =========================================================

DATABASE_URL = f"sqlite:///{RUNTIME_DB}"


# =========================================================
# ENGINE
# =========================================================

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    },
    pool_pre_ping=True,
)


# =========================================================
# SESSION
# =========================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# =========================================================
# BASE
# =========================================================

Base = declarative_base()


# =========================================================
# DEPENDENCY
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
