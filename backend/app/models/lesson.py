from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    order_index = Column(
        Integer,
        nullable=False
    )

    xp_reward = Column(
        Integer,
        default=10
    )