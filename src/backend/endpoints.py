from typing import Annotated
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from fastapi import Depends
from fastapi.datastructures import UploadFile
from fastapi import HTTPException
from fastapi.sse import EventSourceResponse
from pymongo.asynchronous.collection import AsyncCollection

from utils.image_processor import ImageProcessor
from integration.dependencies.mongo import get_collection
from models.response.api_response import APIResponse
from chatbot.outfit_advisor import ChatbotOrchestrator
from auth import get_current_user
from models.request.chat_request import ChatStreamRequest

UserDependency = Annotated[dict, Depends(get_current_user)]

image_router = APIRouter(prefix="/image")


@image_router.post(path="/upload")
async def upload_image_to_db(
    user: UserDependency,
    images: list[UploadFile],
    request: Request,
    collection: AsyncCollection = Depends(get_collection),
):
    """
    What this does: Transform the incoming image using CLIP Processor. Give its information to LLM, response should know the type (topwear, bottomwear), color, texture if possible, what vibe does it give. Store embeddings + the metadata in qdrant database which should be initialized at app startup
    """

    if not user:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    try:
        print(f"Processing {len(images)} for user: {user.get("username")}")
        image_processor = ImageProcessor()
        await image_processor.process_images(user=user, images=images)
        print(f"Successfully Processed {len(images)} for user: {user.get("username")}")

        return JSONResponse(
            content=APIResponse(
                message="Images uploaded successfully to the database",
            ).model_dump(by_alias=True),
            status_code=201,
        )

    except Exception as e:
        return JSONResponse(
            content=APIResponse(
                message=f"Unexpected error while inserting into collection '{collection.name}'",
                errors=[f"Error: {e}"],
            ).model_dump(by_alias=True),
            status_code=500,
        )


chat_router = APIRouter(prefix="/chat")


@chat_router.post("/stream")
async def chat(user: UserDependency, stream_request: ChatStreamRequest):
    """
    What does this do: Takes user message and passes it to LLM for response.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    try:
        chatbot = ChatbotOrchestrator(user_info=user)
        return EventSourceResponse(
            chatbot.invoke(
                user_query=stream_request.message,
                chat_thread_id=stream_request.chat_thread_id,
            )
        )
    except Exception as e:
        return JSONResponse(
            content=APIResponse(errors=[f"Error while chatting: {e}"]).model_dump(
                by_alias=True
            ),
            status_code=500,
        )
