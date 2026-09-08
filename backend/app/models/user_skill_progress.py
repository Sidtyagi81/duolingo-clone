from sqlalchemy import Column, Integer, Boolean, ForeignKey

from app.database import Base


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )

    completed_lessons = Column(
        Integer,
        default=0
    )

    total_xp = Column(
        Integer,
        default=0
    )

    crowns = Column(
        Integer,
        default=0
    )

    is_unlocked = Column(
        Boolean,
        default=False
    )

    completed = Column(
        Boolean,
        default=False
    )