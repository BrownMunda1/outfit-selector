from pymongo.asynchronous.collection import AsyncCollection
from pymongo.results import InsertOneResult, InsertManyResult

from backend.models.schema import ImageUpload

class ImageUploadRepository:

    @classmethod
    async def insert_one(cls, collection: AsyncCollection, data: ImageUpload) -> InsertOneResult:
        result: InsertOneResult = await collection.insert_one(data.model_dump(by_alias=True))
        return result

    @classmethod
    async def insert_many(cls, collection: AsyncCollection, data: list[ImageUpload]) -> InsertManyResult:
        result: InsertManyResult = await collection.insert_many(
            [image.model_dump(by_alias=True) for image in data]
        )
        return result

    @classmethod
    async def find(cls, collection: AsyncCollection):
        result = await collection.find()
        return result

__all__ = [
    "ImageUploadRepository"
]
