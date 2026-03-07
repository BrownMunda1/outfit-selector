from typing import Optional
from threading import Lock

from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.asynchronous.collection import AsyncCollection

class AsyncMongoConnection:

    _lock = Lock()
    _instance = None

    def __new__(cls, uri):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls, uri)
        return cls._instance


    def __init__(self, uri: str = None):
        if not hasattr(self, "_initialized"):
            self._initialized = False
        self.uri = uri
        self._initialized = True

    async def connect(self, database: Optional[str] = None) -> Optional["AsyncMongoConnection"]:
        try:
            self.client = AsyncMongoClient(host=self.uri)
            await self.client.aconnect()

            # Get database
            self.database: AsyncDatabase = self.client[database]

            return self

        except Exception as e:
            raise Exception(f"Unexpected error while connecting to database '{database}'") from e

    async def disconnect(self):
        if self.client:
            self.client.close()

    async def get_collection(self, collection_name: str = "", create: bool = True) -> Optional[AsyncCollection]:
        try:
            collection = self.database.get_collection(collection_name)

            if collection is None:
                if create:
                    try:
                        collection = await self.database.create_collection(name=collection_name)
                    except Exception as e:
                        collection = None
                        raise Exception(f"Unexpected error while creating collection '{collection_name}'") from e
                else:
                    print(f"Collection '{collection_name}' is not present. Pass create=True to create this collection")

            return collection
        except Exception as e:
            raise Exception(f"Unexpected error while fetching collection '{collection_name}'") from e
