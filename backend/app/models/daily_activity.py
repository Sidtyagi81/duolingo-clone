from sqlalchemy import Column, Integer, Date, ForeignKey

from app.database import Base


class DailyActivity(Base):
    __tablename__ = "daily_activity"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    activity_date = Column(
        Date,
        nullable=False
    )

    xp_earned = Column(
        Integer,
        default=0
    )