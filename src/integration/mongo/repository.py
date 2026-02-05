from pymongo.asynchronous.collection import AsyncCollection
from pymongo.results import InsertOneResult

from backend.models.schema import ImageUpload

class ImageUploadRepository:

    @classmethod
    async def insert_one(cls, collection: AsyncCollection, data: ImageUpload) -> InsertOneResult:
        result: InsertOneResult = await collection.insert_one(data.model_dump(by_alias=True))
        return result

__all__ = [
    "ImageUploadRepository"
]
