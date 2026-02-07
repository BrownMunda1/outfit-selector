from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel

class ImageUpload(BaseModel):

    image_file_name: str = Field(
        description="The name of the uploaded file"
    )

    image_data: bytes = Field(
        description="Image data in bytes"
    )

    content_type: str = Field(
        description="Content-Type field from the request"
    )

    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel
    )

__all__ = []
