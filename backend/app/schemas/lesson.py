from pydantic import BaseModel


class AnswerRequest(BaseModel):
    user_id: int
    exercise_id: int
    answer: str