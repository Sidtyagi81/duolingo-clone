from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


class Unit(Base):
    __tablename__ = "units"

    id = Column(
        Integer,
        primary_key=True
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=True
    )

    order_index = Column(
        Integer,
        nullable=False
    )