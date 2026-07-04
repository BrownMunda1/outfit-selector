import os

from fastapi.requests import Request
from pymongo.asynchronous.collection import AsyncCollection

from common.constants import IMAGE_COLLECTION_NAME


async def get_collection(request: Request) -> AsyncCollection:
    return await request.app.state.mongo_db.get_collection(
        collection_name=os.getenv(IMAGE_COLLECTION_NAME)
    )
