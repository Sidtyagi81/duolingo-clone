from pydantic import BaseModel


class LessonCompleteRequest(BaseModel):
    user_id: int
    xp_earned: int = 0