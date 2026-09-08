from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String,
        nullable=False
    )

    source_language = Column(
        String,
        nullable=False
    )

    target_language = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )