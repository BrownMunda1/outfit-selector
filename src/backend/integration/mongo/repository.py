from pymongo.asynchronous.collection import AsyncCollection
from pymongo.results import InsertOneResult, InsertManyResult

from models.schema import ImageUpload, User

class GenericRepository:

    @classmethod
    async def insert_one(cls, collection: AsyncCollection, data: ImageUpload | User) -> InsertOneResult:
        result: InsertOneResult = await collection.insert_one(data.model_dump(by_alias=True))
        return result

    @classmethod
    async def insert_many(cls, collection: AsyncCollection, data: list[ImageUpload | User]) -> InsertManyResult:
        result: InsertManyResult = await collection.insert_many(
            [image.model_dump(by_alias=True) for image in data]
        )
        return result

    @classmethod
    async def find_all(cls, collection: AsyncCollection):
        cursor = collection.find({})
        result = await cursor.to_list(length=None)
        return result

    @classmethod
    async def find_by_user(cls, collection: AsyncCollection, username: str):
        cursor = collection.find({"username": username})
        result = await cursor.to_list(length=None)
        return result

class UserRepository(GenericRepository):

    @classmethod
    async def find(cls, collection: AsyncCollection, username: str):
        cursor = collection.find({"username": username})
        return await cursor.to_list(length=1)


__all__ = [
    "GenericRepository",
    "UserRepository"
]
