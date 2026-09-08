from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    UserSkillProgress,
    Skill,
    Lesson
)


router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)


@router.get("/{user_id}")
def get_user_progress(
    user_id: int,
    db: Session = Depends(get_db)
):
    # ---------------------------------------------------------
    # Get all skills in learning order
    # ---------------------------------------------------------

    skills = (
        db.query(Skill)
        .order_by(
            Skill.unit_id,
            Skill.order_index
        )
        .all()
    )

    result = []

    for index, skill in enumerate(skills):

        # -----------------------------------------------------
        # Get lessons for this skill
        # -----------------------------------------------------

        lessons = (
            db.query(Lesson)
            .filter(
                Lesson.skill_id == skill.id
            )
            .order_by(Lesson.order_index)
            .all()
        )

        total_lessons = len(lessons)

        # -----------------------------------------------------
        # Get existing user progress
        # -----------------------------------------------------

        progress = (
            db.query(UserSkillProgress)
            .filter(
                UserSkillProgress.user_id == user_id,
                UserSkillProgress.skill_id == skill.id
            )
            .first()
        )

        # -----------------------------------------------------
        # Create progress record if it doesn't exist
        # -----------------------------------------------------

        if not progress:

            progress = UserSkillProgress(
                user_id=user_id,
                skill_id=skill.id,
                completed_lessons=0,
                total_xp=0,
                crowns=0,
                is_unlocked=(index == 0),
                completed=False
            )

            db.add(progress)
            db.commit()
            db.refresh(progress)

        # -----------------------------------------------------
        # Calculate completion
        # -----------------------------------------------------

        completed_lessons = progress.completed_lessons or 0

        if total_lessons > 0:
            lesson_percentage = (
                completed_lessons / total_lessons
            ) * 100
        else:
            lesson_percentage = 0

        # -----------------------------------------------------
        # Crown system
        #
        # 0%       -> 0 crowns
        # 1-20%    -> 1 crown
        # 21-40%   -> 2 crowns
        # 41-60%   -> 3 crowns
        # 61-80%   -> 4 crowns
        # 81-100%  -> 5 crowns
        # -----------------------------------------------------

        crowns = min(
            5,
            int(
                lesson_percentage / 20
            )
        )

        if completed_lessons >= total_lessons and total_lessons > 0:
            crowns = 5
            progress.completed = True

        progress.crowns = crowns

        # -----------------------------------------------------
        # Unlock logic
        #
        # First skill is always unlocked.
        # Every next skill unlocks when previous skill
        # is completed.
        # -----------------------------------------------------

        if index == 0:

            progress.is_unlocked = True

        else:

            previous_skill = skills[index - 1]

            previous_progress = (
                db.query(UserSkillProgress)
                .filter(
                    UserSkillProgress.user_id == user_id,
                    UserSkillProgress.skill_id == previous_skill.id
                )
                .first()
            )

            if (
                previous_progress
                and previous_progress.completed
            ):
                progress.is_unlocked = True
            else:
                progress.is_unlocked = False

        db.commit()

        # -----------------------------------------------------
        # Status
        # -----------------------------------------------------

        if progress.completed:

            status = "completed"

        elif progress.is_unlocked:

            status = "available"

        else:

            status = "locked"

        result.append({
            "skill_id": skill.id,
            "completed_lessons": completed_lessons,
            "total_lessons": total_lessons,
            "total_xp": progress.total_xp or 0,
            "crowns": progress.crowns or 0,
            "is_unlocked": bool(
                progress.is_unlocked
            ),
            "completed": bool(
                progress.completed
            ),
            "status": status,
            "progress_percent": round(
                lesson_percentage
            )
        })

    return result