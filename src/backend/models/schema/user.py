from typing import Literal

from pydantic import BaseModel, Field

class User(BaseModel):

    username: str = Field(
        description="The unique username associated with the user",
    )

    password: str = Field(
        description="The hashed password of the user"
    )

    gender: Literal["male", "female"] = Field(
        description="The gender of the user which is used in later stages by the LLM to suggest outfits"
    )

    name: str = Field(
        description="Name of the user",
    )
