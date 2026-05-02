from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from integration.mongo.connection import AsyncMongoConnection
from common.constants import MONGO_URI, MONGO_DATABASE_NAME
from backend.endpoints import image_router
from backend.endpoints import chat_router
from backend.auth import auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv()
    mongodb_client = AsyncMongoConnection(uri=MONGO_URI)
    database = await mongodb_client.connect(database=MONGO_DATABASE_NAME)
    app.state.mongo_db = database
    yield
    await mongodb_client.disconnect()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True
)

app.include_router(router=image_router)
app.include_router(router=chat_router)
app.include_router(router=auth_router)

# Serve static files
# app.mount("/", StaticFiles(directory="frontend", html=True), name="static")


if __name__ == "__main__":
    uvicorn.run(
        app="backend.main:app",
        reload=True
    )
