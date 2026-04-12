from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel

class ImageUpload(BaseModel):

    username: str = Field(
        description="The foreign key from the 'users' collection for identifying the users"
    )

    gender: str = Field(
        description="The gender of the user"
    )

    top: str = Field(
        description="A short 3-4 word description of the clothing above the waist line. Capture the colour and the garment type. If there is no clarity, set the value as 'None'.",
        default=None
    )

    bottom: str = Field(
        description="A short 3-4 word description of the clothing below the waist line. Capture the colour and the garment type. If there is no clarity, set the value as 'None'.",
        default=None
    )

    accessories: str = Field(
        description="A short 3-4 word description of the accessory(ies) worn in the photo. If there is no clarity, set the value as 'None'.",
        default=None
    )

    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel
    )

__all__ = []
