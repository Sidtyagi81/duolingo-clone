from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(
        Integer,
        primary_key=True
    )

    unit_id = Column(
        Integer,
        ForeignKey("units.id"),
        nullable=False
    )

    name = Column(
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