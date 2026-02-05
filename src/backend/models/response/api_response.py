from pydantic import BaseModel, Field

class APIResponse(BaseModel):

    message: str = Field(
        default="",
        description="The message or reason to be given back to the user for the response"
    )

    errors: list[str] = Field(
        default=[],
        description="The errors encountered if any"
    )
