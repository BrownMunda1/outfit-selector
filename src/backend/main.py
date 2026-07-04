import os
from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from integration.mongo.connection import AsyncMongoConnection
from common.constants import MONGO_URI, MONGO_DATABASE_NAME
from endpoints import image_router
from endpoints import chat_router
from auth import auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv()

    mongo_uri = os.getenv(MONGO_URI)
    mongo_database = os.getenv(MONGO_DATABASE_NAME)

    mongodb_client = AsyncMongoConnection(uri=mongo_uri)
    database = await mongodb_client.connect(database=mongo_database)
    app.state.mongo_db = database
    yield
    await mongodb_client.disconnect()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://outfit-selector-bice.vercel.app"],
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True,
)

app.include_router(router=image_router)
app.include_router(router=chat_router)
app.include_router(router=auth_router)

# Serve static files
# app.mount("/", StaticFiles(directory="frontend", html=True), name="static")


if __name__ == "__main__":
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )
