from contextlib import asynccontextmanager

from fastapi import FastAPI
import uvicorn

from integration.mongo.connection import AsyncMongoConnection
from common.constants import MONGO_URI, MONGO_DATABASE_NAME
from backend.endpoints import image_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.mongo = AsyncMongoConnection(uri=MONGO_URI)
    app.state.mongo_db = await app.state.mongo.connect(database=MONGO_DATABASE_NAME)
    yield
    app.state.mongo.disconnect()

app = FastAPI(lifespan=lifespan)

app.include_router(router=image_router)

if __name__ == "__main__":
    uvicorn.run(
        app="backend.main:app",
        reload=True
    )
