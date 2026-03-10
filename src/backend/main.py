from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from integration.mongo.connection import AsyncMongoConnection
from common.constants import MONGO_URI, MONGO_DATABASE_NAME
from backend.endpoints import image_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    mongodb_client = AsyncMongoConnection(uri=MONGO_URI)
    database = await mongodb_client.connect(database=MONGO_DATABASE_NAME)
    app.state.mongo_db = database
    yield
    await mongodb_client.disconnect()

app = FastAPI(lifespan=lifespan)

app.include_router(router=image_router)

# Serve static files
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")


if __name__ == "__main__":
    print("here")
    uvicorn.run(
        app="backend.main:app",
        reload=True
    )
