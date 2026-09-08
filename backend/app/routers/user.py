from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserStats


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/{user_id}/stats")
def get_user_stats(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    stats = db.query(UserStats).filter(
        UserStats.user_id == user_id
    ).first()

    if not stats:
        raise HTTPException(
            status_code=404,
            detail="User stats not found"
        )

    daily_goal = 20

    daily_goal_completed = (
        stats.daily_xp >= daily_goal
    )

    return {
        "user_id": user.id,
        "username": user.username,
        "total_xp": stats.total_xp,
        "daily_xp": stats.daily_xp,
        "daily_goal": daily_goal,
        "daily_goal_completed": daily_goal_completed,
        "streak": stats.streak,
        "hearts": stats.hearts,
        "gems": stats.gems
    }