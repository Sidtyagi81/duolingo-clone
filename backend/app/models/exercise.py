from sqlalchemy import Column, Integer, String, Text, ForeignKey

from app.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True)

    lesson_id = Column(
        Integer,
        ForeignKey("lessons.id"),
        nullable=False
    )

    type = Column(
        String,
        nullable=False
    )

    question = Column(
        Text,
        nullable=False
    )

    correct_answer = Column(
        String,
        nullable=False
    )

    explanation = Column(
        Text,
        nullable=True
    )

    order_index = Column(
        Integer,
        nullable=False
    )