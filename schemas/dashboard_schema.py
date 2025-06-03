from pydantic import BaseModel


class AddToCartRequest(BaseModel):
    course_id: int