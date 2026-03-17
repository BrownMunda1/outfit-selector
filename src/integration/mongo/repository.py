from pymongo.asynchronous.collection import AsyncCollection
from pymongo.results import InsertOneResult, InsertManyResult

from backend.models.schema import ImageUpload

class ImageRepository:

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
    async def find_all(cls, collection: AsyncCollection):
        cursor = collection.find({})
        result = await cursor.to_list(length=None)
        return result

__all__ = [
    "ImageUploadRepository"
]
