from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from datetime import datetime

from app.database import Base


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id"),
        nullable=False
    )

    xp_earned = Column(
        Integer,
        default=0
    )

    mistakes = Column(
        Integer,
        default=0
    )

    completed = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )