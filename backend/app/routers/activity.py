from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models import DailyActivity, UserStats


router = APIRouter(
    prefix="/activity",
    tags=["Activity"]
)


# =========================================================
# GET DAILY ACTIVITY
# =========================================================

@router.get("/{user_id}")
def get_daily_activity(
    user_id: int,
    db: Session = Depends(get_db)
):
    activities = db.query(DailyActivity).filter(
        DailyActivity.user_id == user_id
    ).order_by(
        DailyActivity.activity_date.desc()
    ).all()

    return [
        {
            "activity_date": activity.activity_date,
            "xp_earned": activity.xp_earned
        }
        for activity in activities
    ]


# =========================================================
# RECORD DAILY ACTIVITY
# =========================================================

@router.post("/{user_id}")
def record_daily_activity(
    user_id: int,
    xp_earned: int,
    db: Session = Depends(get_db)
):
    today = date.today()

    activity = db.query(DailyActivity).filter(
        DailyActivity.user_id == user_id,
        DailyActivity.activity_date == today
    ).first()

    # If activity already exists for today,
    # add XP to the existing record.
    if activity:

        activity.xp_earned += xp_earned

    # Otherwise create today's activity.
    else:

        activity = DailyActivity(
            user_id=user_id,
            activity_date=today,
            xp_earned=xp_earned
        )

        db.add(activity)

    db.commit()
    db.refresh(activity)

    return {
        "message": "Daily activity recorded",
        "user_id": user_id,
        "activity_date": activity.activity_date,
        "xp_earned": activity.xp_earned
    }

@router.get("/{user_id}/streak")
def get_streak(
    user_id: int,
    db: Session = Depends(get_db)
):
    activities = db.query(DailyActivity).filter(
        DailyActivity.user_id == user_id
    ).order_by(
        DailyActivity.activity_date.desc()
    ).all()

    if not activities:
        return {
            "user_id": user_id,
            "streak": 0
        }

    today = date.today()

    activity_dates = {
        activity.activity_date
        for activity in activities
        if activity.xp_earned > 0
    }

    if today not in activity_dates:
        streak = 0
    else:
        streak = 0
        current_date = today

        from datetime import timedelta

        while current_date in activity_dates:
            streak += 1
            current_date -= timedelta(days=1)

    # Save streak in UserStats
    user_stats = db.query(UserStats).filter(
        UserStats.user_id == user_id
    ).first()

    if user_stats:
        user_stats.streak = streak
        user_stats.last_activity = today

        db.commit()

    return {
        "user_id": user_id,
        "streak": streak
    }

@router.post("/{user_id}/restore-hearts")
def restore_hearts(
    user_id: int,
    db: Session = Depends(get_db)
):
    from app.models import UserStats

    user_stats = db.query(UserStats).filter(
        UserStats.user_id == user_id
    ).first()

    if not user_stats:
        raise HTTPException(
            status_code=404,
            detail="User stats not found"
        )

    user_stats.hearts = 5

    db.commit()
    db.refresh(user_stats)

    return {
        "message": "Hearts restored",
        "user_id": user_id,
        "hearts": user_stats.hearts
    }