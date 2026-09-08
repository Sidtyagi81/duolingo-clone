from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    Course,
    Unit,
    Skill,
    Lesson,
    UserSkillProgress
)


router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


@router.get("/{course_id}")
def get_course(
    course_id: int,
    db: Session = Depends(get_db)
):

    # ---------------------------------------------------------
    # Default learner
    # ---------------------------------------------------------

    user_id = 1

    # ---------------------------------------------------------
    # Find course
    # ---------------------------------------------------------

    course = (
        db.query(Course)
        .filter(
            Course.id == course_id
        )
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    # ---------------------------------------------------------
    # Get units
    # ---------------------------------------------------------

    units = (
        db.query(Unit)
        .filter(
            Unit.course_id == course.id
        )
        .order_by(
            Unit.order_index
        )
        .all()
    )

    result = []

    # ---------------------------------------------------------
    # Track skill order globally
    # ---------------------------------------------------------

    all_skills = (
        db.query(Skill)
        .join(
            Unit,
            Skill.unit_id == Unit.id
        )
        .filter(
            Unit.course_id == course.id
        )
        .order_by(
            Unit.order_index,
            Skill.order_index
        )
        .all()
    )

    skill_position = {
        skill.id: index
        for index, skill in enumerate(all_skills)
    }

    # ---------------------------------------------------------
    # Process units
    # ---------------------------------------------------------

    for unit in units:

        skills = (
            db.query(Skill)
            .filter(
                Skill.unit_id == unit.id
            )
            .order_by(
                Skill.order_index
            )
            .all()
        )

        skill_data = []

        for skill in skills:

            # -------------------------------------------------
            # Get lessons
            # -------------------------------------------------

            lessons = (
                db.query(Lesson)
                .filter(
                    Lesson.skill_id == skill.id
                )
                .order_by(
                    Lesson.order_index
                )
                .all()
            )

            total_lessons = len(lessons)

            # -------------------------------------------------
            # Get progress
            # -------------------------------------------------

            progress = (
                db.query(UserSkillProgress)
                .filter(
                    UserSkillProgress.user_id == user_id,
                    UserSkillProgress.skill_id == skill.id
                )
                .first()
            )

            # -------------------------------------------------
            # Create progress if missing
            # -------------------------------------------------

            if not progress:

                is_first_skill = (
                    skill_position[skill.id] == 0
                )

                progress = UserSkillProgress(
                    user_id=user_id,
                    skill_id=skill.id,
                    completed_lessons=0,
                    total_xp=0,
                    crowns=0,
                    is_unlocked=is_first_skill,
                    completed=False
                )

                db.add(progress)
                db.commit()
                db.refresh(progress)

            # -------------------------------------------------
            # Determine unlock status
            # -------------------------------------------------

            current_position = skill_position[
                skill.id
            ]

            if current_position == 0:

                progress.is_unlocked = True

            else:

                previous_skill = all_skills[
                    current_position - 1
                ]

                previous_progress = (
                    db.query(UserSkillProgress)
                    .filter(
                        UserSkillProgress.user_id == user_id,
                        UserSkillProgress.skill_id == previous_skill.id
                    )
                    .first()
                )

                progress.is_unlocked = bool(
                    previous_progress
                    and previous_progress.completed
                )

            # -------------------------------------------------
            # Calculate progress
            # -------------------------------------------------

            completed_lessons = (
                progress.completed_lessons or 0
            )

            if total_lessons > 0:

                progress_percent = round(
                    (
                        completed_lessons
                        / total_lessons
                    ) * 100
                )

            else:

                progress_percent = 0

            # -------------------------------------------------
            # Calculate crowns
            # -------------------------------------------------

            crowns = min(
                5,
                int(
                    progress_percent / 20
                )
            )

            if (
                completed_lessons >= total_lessons
                and total_lessons > 0
            ):

                crowns = 5
                progress.completed = True

            progress.crowns = crowns

            # -------------------------------------------------
            # Status
            # -------------------------------------------------

            if progress.completed:

                status = "completed"

            elif progress.is_unlocked:

                status = "available"

            else:

                status = "locked"

            db.commit()

            # -------------------------------------------------
            # Lesson data
            # -------------------------------------------------

            lesson_data = [
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "order_index": lesson.order_index,
                    "xp_reward": lesson.xp_reward
                }
                for lesson in lessons
            ]

            # -------------------------------------------------
            # Skill response
            # -------------------------------------------------

            skill_data.append({
                "id": skill.id,
                "name": skill.name,
                "description": skill.description,
                "order_index": skill.order_index,

                # Progress information
                "completed_lessons": completed_lessons,
                "total_lessons": total_lessons,
                "progress_percent": progress_percent,
                "crowns": crowns,

                # State
                "is_unlocked": bool(
                    progress.is_unlocked
                ),
                "completed": bool(
                    progress.completed
                ),
                "status": status,

                # Lessons
                "lessons": lesson_data
            })

        result.append({
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "order_index": unit.order_index,
            "skills": skill_data
        })

    return {
        "id": course.id,
        "name": course.name,
        "source_language": course.source_language,
        "target_language": course.target_language,
        "description": course.description,
        "units": result
    }