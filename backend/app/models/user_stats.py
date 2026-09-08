from sqlalchemy import Column, Integer, Date, ForeignKey

from app.database import Base


class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    total_xp = Column(
        Integer,
        default=0
    )

    daily_xp = Column(
        Integer,
        default=0
    )

    streak = Column(
        Integer,
        default=0
    )

    hearts = Column(
        Integer,
        default=5
    )

    gems = Column(
        Integer,
        default=100
    )

    last_activity = Column(
        Date,
        nullable=True
    )