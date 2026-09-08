from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(
        Integer,
        primary_key=True
    )

    exercise_id = Column(
        Integer,
        ForeignKey("exercises.id"),
        nullable=False
    )

    text = Column(
        String,
        nullable=False
    )

    is_correct = Column(
        Integer,
        default=0
    )

    order_index = Column(
        Integer,
        nullable=False
    )