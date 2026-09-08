from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    Lesson,
    Exercise,
    ExerciseOption,
    UserStats,
    UserSkillProgress,
    LessonAttempt,
    DailyActivity,
)
from app.schemas.lesson import AnswerRequest
from app.schemas.progress import LessonCompleteRequest


router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"],
)


# =========================================================
# HELPERS
# =========================================================

def normalize_text(value: str) -> str:
    """
    Normalize ordinary text answers.

    Examples:
        " Hola "       -> "hola"
        "Thank   you"  -> "thank you"
    """
    if value is None:
        return ""

    return " ".join(
        str(value).strip().lower().split()
    )


def normalize_match_pairs(value: str):
    """
    Convert match-pairs answer into a normalized set.

    Example:

        hola=hello|gracias=thank you|
        adiós=goodbye|por favor=please

    becomes:

        {
            ("hola", "hello"),
            ("gracias", "thank you"),
            ("adiós", "goodbye"),
            ("por favor", "please")
        }

    Order does not matter.
    """

    pairs = set()

    if not value:
        return pairs

    for pair in str(value).split("|"):
        pair = pair.strip()

        if "=" not in pair:
            continue

        left, right = pair.split("=", 1)

        left = normalize_text(left)
        right = normalize_text(right)

        if left and right:
            pairs.add((left, right))

    return pairs


def record_daily_activity(
    db: Session,
    user_id: int,
    xp_earned: int,
):
    """
    Add XP to today's daily activity record.
    """

    today = date.today()

    activity = (
        db.query(DailyActivity)
        .filter(
            DailyActivity.user_id == user_id,
            DailyActivity.activity_date == today,
        )
        .first()
    )

    if activity:
        activity.xp_earned += xp_earned
    else:
        activity = DailyActivity(
            user_id=user_id,
            activity_date=today,
            xp_earned=xp_earned,
        )

        db.add(activity)


def update_streak(user_stats: UserStats):
    """
    Update learner's daily streak.
    """

    today = date.today()

    # Already practiced today.
    if user_stats.last_activity == today:
        return

    # Practiced yesterday.
    if user_stats.last_activity == today - timedelta(days=1):
        user_stats.streak += 1

    # First activity or streak broken.
    else:
        user_stats.streak = 1

    user_stats.last_activity = today


# =========================================================
# USER STATS
# =========================================================

def get_or_create_user_stats(
    db: Session,
    user_id: int,
):
    """
    Return stats for this account.

    If stats do not exist, create them with:
        hearts = 5
        XP = 0
        streak = 0
    """

    user_stats = (
        db.query(UserStats)
        .filter(
            UserStats.user_id == user_id
        )
        .first()
    )

    if user_stats:
        return user_stats

    user_stats = UserStats(
        user_id=user_id,
        hearts=5,
        total_xp=0,
        daily_xp=0,
        streak=0,
        last_activity=None,
    )

    db.add(user_stats)
    db.flush()

    return user_stats


# =========================================================
# GET LESSON
# =========================================================

@router.get("/{lesson_id}")
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    """
    Return lesson information.

    IMPORTANT:
    correct_answer is NEVER returned to frontend.
    """

    if lesson_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid lesson ID",
        )

    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    exercises = (
        db.query(Exercise)
        .filter(
            Exercise.lesson_id == lesson.id
        )
        .order_by(
            Exercise.order_index
        )
        .all()
    )

    exercise_data = []

    for exercise in exercises:

        data = {
            "id": exercise.id,
            "type": exercise.type,
            "question": exercise.question,
            "explanation": exercise.explanation,
            "order_index": exercise.order_index,
        }

        # -------------------------------------------------
        # Multiple choice options
        # -------------------------------------------------

        if exercise.type == "multiple_choice":

            options = (
                db.query(ExerciseOption)
                .filter(
                    ExerciseOption.exercise_id
                    == exercise.id
                )
                .order_by(
                    ExerciseOption.order_index
                )
                .all()
            )

            data["options"] = [
                {
                    "id": option.id,
                    "text": option.text,
                }
                for option in options
            ]

        exercise_data.append(data)

    return {
        "id": lesson.id,
        "title": lesson.title,
        "xp_reward": lesson.xp_reward,
        "exercises": exercise_data,
    }


# =========================================================
# SUBMIT ANSWER
# =========================================================

@router.post("/{lesson_id}/answer")
def submit_answer(
    lesson_id: int,
    request: AnswerRequest,
    db: Session = Depends(get_db),
):
    """
    Validate an exercise answer.

    Backend is the source of truth for:
        - correctness
        - XP
        - hearts
        - streak
    """

    # -----------------------------------------------------
    # Validate IDs
    # -----------------------------------------------------

    if lesson_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid lesson ID",
        )

    if request.exercise_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid exercise ID",
        )

    if request.user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID",
        )

    answer = normalize_text(request.answer)

    if not answer:
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty",
        )

    # -----------------------------------------------------
    # Find exercise
    # -----------------------------------------------------

    exercise = (
        db.query(Exercise)
        .filter(
            Exercise.id == request.exercise_id,
            Exercise.lesson_id == lesson_id,
        )
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found",
        )

    # -----------------------------------------------------
    # IMPORTANT
    #
    # Use the actual user sent by frontend.
    #
    # DO NOT use:
    #
    # user_id = 1
    #
    # -----------------------------------------------------

    user_id = request.user_id

    # -----------------------------------------------------
    # Get/create stats
    # -----------------------------------------------------

    user_stats = get_or_create_user_stats(
        db,
        user_id,
    )

    # -----------------------------------------------------
    # Check hearts
    # -----------------------------------------------------

    if user_stats.hearts <= 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "No hearts remaining. "
                "Please restore hearts."
            ),
        )

    # =====================================================
    # MATCH PAIRS
    # =====================================================

    if exercise.type == "match_pairs":

        # -------------------------------------------------
        # Temporary wrong pair
        #
        # This should NOT consume a heart.
        # -------------------------------------------------

        if answer == "wrong-match":

            return {
                "correct": False,
                "xp_earned": 0,
                "hearts_remaining": user_stats.hearts,
                "total_xp": user_stats.total_xp,
                "daily_xp": user_stats.daily_xp,
                "streak": user_stats.streak,
                "gems": getattr(
                    user_stats,
                    "gems",
                    None,
                ),
                "explanation": (
                    "That pair does not match. "
                    "Try another combination."
                ),
            }

        # -------------------------------------------------
        # Submitted pairs
        # -------------------------------------------------

        user_pairs = normalize_match_pairs(
            request.answer
        )

        # -------------------------------------------------
        # Correct pairs
        # -------------------------------------------------

        correct_pairs = normalize_match_pairs(
            exercise.correct_answer
        )

        # -------------------------------------------------
        # Compare sets
        # -------------------------------------------------

        is_correct = (
            len(user_pairs) > 0
            and len(user_pairs) == len(correct_pairs)
            and user_pairs == correct_pairs
        )

        # -------------------------------------------------
        # Correct match
        # -------------------------------------------------

        if is_correct:

            xp_earned = 10

            user_stats.total_xp += xp_earned
            user_stats.daily_xp += xp_earned

            record_daily_activity(
                db,
                user_id,
                xp_earned,
            )

            update_streak(
                user_stats
            )

            db.commit()
            db.refresh(user_stats)

            return {
                "correct": True,
                "xp_earned": xp_earned,
                "hearts_remaining": user_stats.hearts,
                "total_xp": user_stats.total_xp,
                "daily_xp": user_stats.daily_xp,
                "streak": user_stats.streak,
                "gems": getattr(
                    user_stats,
                    "gems",
                    None,
                ),
                "explanation": exercise.explanation,
            }

        # -------------------------------------------------
        # Wrong final match
        # -------------------------------------------------

        user_stats.hearts = max(
            0,
            user_stats.hearts - 1,
        )

        update_streak(
            user_stats
        )

        db.commit()
        db.refresh(user_stats)

        return {
            "correct": False,
            "xp_earned": 0,
            "hearts_remaining": user_stats.hearts,
            "total_xp": user_stats.total_xp,
            "daily_xp": user_stats.daily_xp,
            "streak": user_stats.streak,
            "gems": getattr(
                user_stats,
                "gems",
                None,
            ),
            "explanation": exercise.explanation,
        }

    # =====================================================
    # NORMAL EXERCISES
    # =====================================================

    user_answer = normalize_text(
        request.answer
    )

    correct_answer = normalize_text(
        exercise.correct_answer
    )

    is_correct = (
        user_answer == correct_answer
    )

    # -----------------------------------------------------
    # Correct answer
    # -----------------------------------------------------

    if is_correct:

        xp_earned = 10

        user_stats.total_xp += xp_earned
        user_stats.daily_xp += xp_earned

        record_daily_activity(
            db,
            user_id,
            xp_earned,
        )

        update_streak(
            user_stats
        )

    # -----------------------------------------------------
    # Wrong answer
    # -----------------------------------------------------

    else:

        xp_earned = 0

        user_stats.hearts = max(
            0,
            user_stats.hearts - 1,
        )

        update_streak(
            user_stats
        )

    # -----------------------------------------------------
    # Save
    # -----------------------------------------------------

    db.commit()
    db.refresh(user_stats)

    return {
        "correct": is_correct,
        "xp_earned": xp_earned,
        "hearts_remaining": user_stats.hearts,
        "total_xp": user_stats.total_xp,
        "daily_xp": user_stats.daily_xp,
        "streak": user_stats.streak,
        "gems": getattr(
            user_stats,
            "gems",
            None,
        ),
        "explanation": exercise.explanation,
    }


# =========================================================
# RESTORE HEARTS
# =========================================================

@router.post("/restore-hearts/{user_id}")
def restore_hearts(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Restore learner's hearts to 5.
    """

    if user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID",
        )

    user_stats = get_or_create_user_stats(
        db,
        user_id,
    )

    user_stats.hearts = 5

    db.commit()
    db.refresh(user_stats)

    return {
        "message": "Hearts restored successfully",
        "user_id": user_id,
        "hearts": user_stats.hearts,
        "gems": getattr(
            user_stats,
            "gems",
            None,
        ),
        "streak": user_stats.streak,
        "total_xp": user_stats.total_xp,
    }


# =========================================================
# COMPLETE LESSON
# =========================================================

@router.post("/{lesson_id}/complete")
def complete_lesson(
    lesson_id: int,
    request: LessonCompleteRequest,
    db: Session = Depends(get_db),
):
    """
    Mark lesson as completed.

    XP has already been awarded by /answer.
    Therefore this endpoint does NOT add XP
    to UserStats again.
    """

    if lesson_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid lesson ID",
        )

    if request.user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID",
        )

    lesson = (
        db.query(Lesson)
        .filter(
            Lesson.id == lesson_id
        )
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    user_stats = get_or_create_user_stats(
        db,
        request.user_id,
    )

    progress = (
        db.query(UserSkillProgress)
        .filter(
            UserSkillProgress.user_id
            == request.user_id,
            UserSkillProgress.skill_id
            == lesson.skill_id,
        )
        .first()
    )

    if not progress:

        progress = UserSkillProgress(
            user_id=request.user_id,
            skill_id=lesson.skill_id,
            completed_lessons=0,
            total_xp=0,
            completed=False,
            is_unlocked=True,
        )

        db.add(progress)
        db.flush()

    # -----------------------------------------------------
    # Already completed?
    # -----------------------------------------------------

    existing_attempt = (
        db.query(LessonAttempt)
        .filter(
            LessonAttempt.user_id
            == request.user_id,
            LessonAttempt.lesson_id
            == lesson_id,
            LessonAttempt.completed == True,
        )
        .first()
    )

    if existing_attempt:

        return {
            "message": "Lesson already completed",
            "lesson_id": lesson.id,
            "completed_lessons":
                progress.completed_lessons,
            "total_xp":
                progress.total_xp,
            "completed":
                progress.completed,
            "streak":
                user_stats.streak,
            "hearts":
                user_stats.hearts,
            "total_user_xp":
                user_stats.total_xp,
        }

    # -----------------------------------------------------
    # XP earned during this lesson
    # -----------------------------------------------------

    lesson_xp = max(
        0,
        int(request.xp_earned or 0),
    )

    # -----------------------------------------------------
    # Create lesson attempt
    # -----------------------------------------------------

    attempt = LessonAttempt(
        user_id=request.user_id,
        lesson_id=lesson_id,
        xp_earned=lesson_xp,
        mistakes=0,
        completed=True,
    )

    db.add(attempt)

    # -----------------------------------------------------
    # Update skill progress
    # -----------------------------------------------------

    progress.completed_lessons += 1
    progress.total_xp += lesson_xp
    progress.is_unlocked = True

    # -----------------------------------------------------
    # Determine skill completion
    # -----------------------------------------------------

    total_lessons = (
        db.query(Lesson)
        .filter(
            Lesson.skill_id
            == lesson.skill_id
        )
        .count()
    )

    if (
        total_lessons > 0
        and progress.completed_lessons
        >= total_lessons
    ):
        progress.completed = True

    # -----------------------------------------------------
    # Ensure daily activity exists
    # -----------------------------------------------------

    if lesson_xp > 0:
        record_daily_activity(
            db,
            request.user_id,
            0,
        )

    # -----------------------------------------------------
    # Save
    # -----------------------------------------------------

    db.commit()

    db.refresh(progress)
    db.refresh(user_stats)

    return {
        "message": "Lesson completed successfully",
        "lesson_id": lesson.id,
        "completed_lessons":
            progress.completed_lessons,
        "total_xp":
            progress.total_xp,
        "completed":
            progress.completed,
        "streak":
            user_stats.streak,
        "hearts":
            user_stats.hearts,
        "total_user_xp":
            user_stats.total_xp,
    }
