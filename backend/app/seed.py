from app.database import SessionLocal
from app.models import (
    User,
    UserStats,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    ExerciseOption,
    UserSkillProgress,
)


def add_multiple_choice(
    db,
    lesson_id,
    question,
    correct_answer,
    options,
    explanation,
    order_index,
):
    """
    Create a multiple-choice exercise and its options.
    """

    exercise = Exercise(
        lesson_id=lesson_id,
        type="multiple_choice",
        question=question,
        correct_answer=correct_answer,
        explanation=explanation,
        order_index=order_index,
    )

    db.add(exercise)
    db.flush()

    for index, option_text in enumerate(options, start=1):
        db.add(
            ExerciseOption(
                exercise_id=exercise.id,
                text=option_text,
                is_correct=(
                    1
                    if option_text == correct_answer
                    else 0
                ),
                order_index=index,
            )
        )


def add_text_exercise(
    db,
    lesson_id,
    exercise_type,
    question,
    correct_answer,
    explanation,
    order_index,
):
    """
    Create translation, fill-blank, or type-answer exercise.
    """

    exercise = Exercise(
        lesson_id=lesson_id,
        type=exercise_type,
        question=question,
        correct_answer=correct_answer,
        explanation=explanation,
        order_index=order_index,
    )

    db.add(exercise)


def add_match_exercise(
    db,
    lesson_id,
    question,
    explanation,
    order_index,
):
    """
    Create a match-pairs exercise.

    IMPORTANT:
    This format must match the backend matcher:

    hola=hello|
    gracias=thank you|
    adiós=goodbye|
    por favor=please
    """

    exercise = Exercise(
        lesson_id=lesson_id,
        type="match_pairs",
        question=question,
        correct_answer=(
            "Hola=Hello|"
            "Gracias=Thank you|"
            "Adiós=Goodbye|"
            "Por favor=Please"
        ),
        explanation=explanation,
        order_index=order_index,
    )

    db.add(exercise)


def create_lesson(
    db,
    skill_id,
    title,
    order_index,
    xp_reward,
    exercises,
):
    """
    Create a lesson and all of its exercises.
    """

    lesson = Lesson(
        skill_id=skill_id,
        title=title,
        order_index=order_index,
        xp_reward=xp_reward,
    )

    db.add(lesson)
    db.flush()

    for exercise in exercises:

        exercise_type = exercise["type"]

        if exercise_type == "multiple_choice":

            add_multiple_choice(
                db=db,
                lesson_id=lesson.id,
                question=exercise["question"],
                correct_answer=exercise["correct_answer"],
                options=exercise["options"],
                explanation=exercise["explanation"],
                order_index=exercise["order_index"],
            )

        elif exercise_type == "match_pairs":

            add_match_exercise(
                db=db,
                lesson_id=lesson.id,
                question=exercise["question"],
                explanation=exercise["explanation"],
                order_index=exercise["order_index"],
            )

        else:

            add_text_exercise(
                db=db,
                lesson_id=lesson.id,
                exercise_type=exercise_type,
                question=exercise["question"],
                correct_answer=exercise["correct_answer"],
                explanation=exercise["explanation"],
                order_index=exercise["order_index"],
            )

    return lesson


def seed_database():

    db = SessionLocal()

    try:

        # =====================================================
        # PREVENT DUPLICATE SEEDING
        # =====================================================

        if db.query(User).first():

            print(
                "Database already contains data."
            )

            print(
                "Delete backend/duolingo.db "
                "if you want to recreate the seed data."
            )

            return

        # =====================================================
        # USER
        # =====================================================

        user = User(
            username="learner",
            email="learner@example.com",
        )

        db.add(user)
        db.flush()

        # =====================================================
        # USER STATS
        # =====================================================

        stats = UserStats(
            user_id=user.id,
            total_xp=0,
            daily_xp=0,
            streak=0,
            hearts=5,
            gems=100,
        )

        db.add(stats)

        # =====================================================
        # COURSE
        # =====================================================

        course = Course(
            name="Spanish",
            source_language="English",
            target_language="Spanish",
            description=(
                "Learn Spanish from English through "
                "short interactive lessons."
            ),
        )

        db.add(course)
        db.flush()

        # =====================================================
        # UNIT 1
        # =====================================================

        unit = Unit(
            course_id=course.id,
            title="Basics",
            description=(
                "Learn essential Spanish words, "
                "greetings, and phrases."
            ),
            order_index=1,
        )

        db.add(unit)
        db.flush()

        # =====================================================
        # SKILL 1 — GREETINGS
        # =====================================================

        skill1 = Skill(
            unit_id=unit.id,
            name="Greetings",
            description=(
                "Learn common Spanish greetings "
                "and introductions."
            ),
            order_index=1,
        )

        db.add(skill1)
        db.flush()

        # -----------------------------------------------------
        # LESSON 1 — BASIC GREETINGS
        # -----------------------------------------------------

        lesson1_exercises = [

            {
                "type": "multiple_choice",
                "question": (
                    "How do you say 'Hello' in Spanish?"
                ),
                "correct_answer": "Hola",
                "options": [
                    "Hola",
                    "Gracias",
                    "Adiós",
                    "Por favor",
                ],
                "explanation": (
                    "'Hola' means 'Hello' in Spanish."
                ),
                "order_index": 1,
            },

            {
                "type": "translation",
                "question": (
                    "Translate: 'Good morning'"
                ),
                "correct_answer": "Buenos días",
                "explanation": (
                    "'Buenos días' means "
                    "'Good morning'."
                ),
                "order_index": 2,
            },

            {
                "type": "fill_blank",
                "question": "___ días",
                "correct_answer": "Buenos",
                "explanation": (
                    "The complete phrase is "
                    "'Buenos días'."
                ),
                "order_index": 3,
            },

            {
                "type": "type_answer",
                "question": (
                    "Type the Spanish word for "
                    "'Thank you'."
                ),
                "correct_answer": "Gracias",
                "explanation": (
                    "'Gracias' means 'Thank you'."
                ),
                "order_index": 4,
            },

            {
                "type": "match_pairs",
                "question": (
                    "Match the Spanish words "
                    "with their English meanings."
                ),
                "explanation": (
                    "Match each Spanish word "
                    "with its English meaning."
                ),
                "order_index": 5,
            },
        ]

        create_lesson(
            db=db,
            skill_id=skill1.id,
            title="Basic Greetings",
            order_index=1,
            xp_reward=10,
            exercises=lesson1_exercises,
        )

        # -----------------------------------------------------
        # LESSON 2 — INTRODUCTIONS
        # -----------------------------------------------------

        lesson2_exercises = [

            {
                "type": "multiple_choice",
                "question": (
                    "What does 'Me llamo' mean?"
                ),
                "correct_answer": "My name is",
                "options": [
                    "My name is",
                    "Goodbye",
                    "Thank you",
                    "Good morning",
                ],
                "explanation": (
                    "'Me llamo' is used to say "
                    "'My name is'."
                ),
                "order_index": 1,
            },

            {
                "type": "translation",
                "question": (
                    "Translate: 'My name is Carlos'"
                ),
                "correct_answer": (
                    "Me llamo Carlos"
                ),
                "explanation": (
                    "'Me llamo' means "
                    "'My name is'."
                ),
                "order_index": 2,
            },

            {
                "type": "fill_blank",
                "question": (
                    "Me ___ Ana."
                ),
                "correct_answer": "llamo",
                "explanation": (
                    "The phrase is "
                    "'Me llamo Ana'."
                ),
                "order_index": 3,
            },

            {
                "type": "type_answer",
                "question": (
                    "Type the Spanish word for "
                    "'name'."
                ),
                "correct_answer": "nombre",
                "explanation": (
                    "'Nombre' means 'name'."
                ),
                "order_index": 4,
            },

            {
                "type": "multiple_choice",
                "question": (
                    "How do you ask someone's name?"
                ),
                "correct_answer": (
                    "¿Cómo te llamas?"
                ),
                "options": [
                    "¿Cómo te llamas?",
                    "Buenos días",
                    "Hasta luego",
                    "Gracias",
                ],
                "explanation": (
                    "'¿Cómo te llamas?' means "
                    "'What is your name?'"
                ),
                "order_index": 5,
            },
        ]

        create_lesson(
            db=db,
            skill_id=skill1.id,
            title="Introductions",
            order_index=2,
            xp_reward=10,
            exercises=lesson2_exercises,
        )

        # =====================================================
        # SKILL 2 — COMMON WORDS
        # =====================================================

        skill2 = Skill(
            unit_id=unit.id,
            name="Common Words",
            description=(
                "Learn useful everyday Spanish words."
            ),
            order_index=2,
        )

        db.add(skill2)
        db.flush()

        # -----------------------------------------------------
        # LESSON 3 — EVERYDAY WORDS
        # -----------------------------------------------------

        lesson3_exercises = [

            {
                "type": "multiple_choice",
                "question": (
                    "What does 'sí' mean?"
                ),
                "correct_answer": "Yes",
                "options": [
                    "Yes",
                    "No",
                    "Please",
                    "Thanks",
                ],
                "explanation": (
                    "'Sí' means 'Yes'."
                ),
                "order_index": 1,
            },

            {
                "type": "translation",
                "question": (
                    "Translate: 'No'"
                ),
                "correct_answer": "No",
                "explanation": (
                    "'No' means 'No'."
                ),
                "order_index": 2,
            },

            {
                "type": "fill_blank",
                "question": (
                    "___, gracias."
                ),
                "correct_answer": "No",
                "explanation": (
                    "'No, gracias' means "
                    "'No, thank you'."
                ),
                "order_index": 3,
            },

            {
                "type": "type_answer",
                "question": (
                    "Type the Spanish word for "
                    "'yes'."
                ),
                "correct_answer": "Sí",
                "explanation": (
                    "'Sí' means 'yes'."
                ),
                "order_index": 4,
            },

            {
                "type": "multiple_choice",
                "question": (
                    "What does 'agua' mean?"
                ),
                "correct_answer": "Water",
                "options": [
                    "Water",
                    "Food",
                    "House",
                    "Book",
                ],
                "explanation": (
                    "'Agua' means 'water'."
                ),
                "order_index": 5,
            },
        ]

        create_lesson(
            db=db,
            skill_id=skill2.id,
            title="Everyday Words",
            order_index=1,
            xp_reward=10,
            exercises=lesson3_exercises,
        )

        # -----------------------------------------------------
        # LESSON 4 — POLITE WORDS
        # -----------------------------------------------------

        lesson4_exercises = [

            {
                "type": "multiple_choice",
                "question": (
                    "How do you say 'Please'?"
                ),
                "correct_answer": "Por favor",
                "options": [
                    "Por favor",
                    "Gracias",
                    "Hola",
                    "Adiós",
                ],
                "explanation": (
                    "'Por favor' means 'Please'."
                ),
                "order_index": 1,
            },

            {
                "type": "translation",
                "question": (
                    "Translate: 'Thank you very much'"
                ),
                "correct_answer": (
                    "Muchas gracias"
                ),
                "explanation": (
                    "'Muchas gracias' means "
                    "'Thank you very much'."
                ),
                "order_index": 2,
            },

            {
                "type": "fill_blank",
                "question": (
                    "Muchas ___."
                ),
                "correct_answer": "gracias",
                "explanation": (
                    "The phrase is "
                    "'Muchas gracias'."
                ),
                "order_index": 3,
            },

            {
                "type": "type_answer",
                "question": (
                    "Type the Spanish phrase for "
                    "'Please'."
                ),
                "correct_answer": "Por favor",
                "explanation": (
                    "'Por favor' means 'Please'."
                ),
                "order_index": 4,
            },

            {
                "type": "multiple_choice",
                "question": (
                    "What does 'de nada' mean?"
                ),
                "correct_answer": "You're welcome",
                "options": [
                    "You're welcome",
                    "Good morning",
                    "Goodbye",
                    "Please",
                ],
                "explanation": (
                    "'De nada' means "
                    "'You're welcome'."
                ),
                "order_index": 5,
            },
        ]

        create_lesson(
            db=db,
            skill_id=skill2.id,
            title="Polite Words",
            order_index=2,
            xp_reward=10,
            exercises=lesson4_exercises,
        )

        # =====================================================
        # SKILL 3 — SIMPLE PHRASES
        # =====================================================

        skill3 = Skill(
            unit_id=unit.id,
            name="Simple Phrases",
            description=(
                "Practice useful Spanish phrases "
                "for everyday conversations."
            ),
            order_index=3,
        )

        db.add(skill3)
        db.flush()

        # -----------------------------------------------------
        # LESSON 5 — SIMPLE QUESTIONS
        # -----------------------------------------------------

        lesson5_exercises = [

            {
                "type": "multiple_choice",
                "question": (
                    "What does '¿Cómo estás?' mean?"
                ),
                "correct_answer": "How are you?",
                "options": [
                    "How are you?",
                    "What is your name?",
                    "Where are you?",
                    "Goodbye",
                ],
                "explanation": (
                    "'¿Cómo estás?' means "
                    "'How are you?'"
                ),
                "order_index": 1,
            },

            {
                "type": "translation",
                "question": (
                    "Translate: 'Where are you?'"
                ),
                "correct_answer": (
                    "¿Dónde estás?"
                ),
                "explanation": (
                    "'¿Dónde estás?' means "
                    "'Where are you?'"
                ),
                "order_index": 2,
            },

            {
                "type": "fill_blank",
                "question": (
                    "¿Cómo ___?"
                ),
                "correct_answer": "estás",
                "explanation": (
                    "The phrase is "
                    "'¿Cómo estás?'"
                ),
                "order_index": 3,
            },

            {
                "type": "type_answer",
                "question": (
                    "Type the Spanish word for "
                    "'where'."
                ),
                "correct_answer": "dónde",
                "explanation": (
                    "'Dónde' means 'where'."
                ),
                "order_index": 4,
            },

            {
                "type": "multiple_choice",
                "question": (
                    "What does '¿Qué?' mean?"
                ),
                "correct_answer": "What?",
                "options": [
                    "What?",
                    "Where?",
                    "Who?",
                    "When?",
                ],
                "explanation": (
                    "'¿Qué?' means 'What?'"
                ),
                "order_index": 5,
            },
        ]

        create_lesson(
            db=db,
            skill_id=skill3.id,
            title="Simple Questions",
            order_index=1,
            xp_reward=10,
            exercises=lesson5_exercises,
        )

        # -----------------------------------------------------
        # LESSON 6 — SIMPLE ANSWERS
        # -----------------------------------------------------

        lesson6_exercises = [

            {
                "type": "multiple_choice",
                "question": (
                    "How do you say 'I am good'?"
                ),
                "correct_answer": "Estoy bien",
                "options": [
                    "Estoy bien",
                    "Estoy aquí",
                    "Me llamo",
                    "Hasta luego",
                ],
                "explanation": (
                    "'Estoy bien' means "
                    "'I am good'."
                ),
                "order_index": 1,
            },

            {
                "type": "translation",
                "question": (
                    "Translate: 'I am here'"
                ),
                "correct_answer": (
                    "Estoy aquí"
                ),
                "explanation": (
                    "'Estoy aquí' means "
                    "'I am here'."
                ),
                "order_index": 2,
            },

            {
                "type": "fill_blank",
                "question": (
                    "Estoy ___."
                ),
                "correct_answer": "bien",
                "explanation": (
                    "'Estoy bien' means "
                    "'I am good'."
                ),
                "order_index": 3,
            },

            {
                "type": "type_answer",
                "question": (
                    "Type the Spanish word for "
                    "'here'."
                ),
                "correct_answer": "aquí",
                "explanation": (
                    "'Aquí' means 'here'."
                ),
                "order_index": 4,
            },

            {
                "type": "multiple_choice",
                "question": (
                    "What does 'Hasta luego' mean?"
                ),
                "correct_answer": "See you later",
                "options": [
                    "See you later",
                    "Thank you",
                    "Good morning",
                    "Please",
                ],
                "explanation": (
                    "'Hasta luego' means "
                    "'See you later'."
                ),
                "order_index": 5,
            },
        ]

        create_lesson(
            db=db,
            skill_id=skill3.id,
            title="Simple Answers",
            order_index=2,
            xp_reward=10,
            exercises=lesson6_exercises,
        )

        # =====================================================
        # INITIAL USER SKILL PROGRESS
        # =====================================================

        # Skill 1 is unlocked.
        progress1 = UserSkillProgress(
            user_id=user.id,
            skill_id=skill1.id,
            completed_lessons=0,
            total_xp=0,
            crowns=0,
            is_unlocked=True,
            completed=False,
        )

        # Skill 2 starts locked.
        progress2 = UserSkillProgress(
            user_id=user.id,
            skill_id=skill2.id,
            completed_lessons=0,
            total_xp=0,
            crowns=0,
            is_unlocked=False,
            completed=False,
        )

        # Skill 3 starts locked.
        progress3 = UserSkillProgress(
            user_id=user.id,
            skill_id=skill3.id,
            completed_lessons=0,
            total_xp=0,
            crowns=0,
            is_unlocked=False,
            completed=False,
        )

        db.add_all([
            progress1,
            progress2,
            progress3,
        ])

        # =====================================================
        # SAVE EVERYTHING
        # =====================================================

        db.commit()

        print(
            "Database seeded successfully!"
        )

        print(
            "Created:"
        )

        print(
            "  1 course"
        )

        print(
            "  1 unit"
        )

        print(
            "  3 skills"
        )

        print(
            "  6 lessons"
        )

        print(
            "  30 exercises"
        )

        print(
            "  1 learner"
        )

    except Exception as e:

        db.rollback()

        print(
            f"Error while seeding database: {e}"
        )

    finally:

        db.close()


if __name__ == "__main__":
    seed_database()