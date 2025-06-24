from pydantic import BaseModel

class StepProgressUpdate(BaseModel):
    user_id: int
    course_id: int
    step_id: int
    completed: bool
