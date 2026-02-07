from bson.binary import Binary
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from fastapi import Depends
from fastapi.datastructures import UploadFile
from pymongo.asynchronous.collection import AsyncCollection

from integration.dependencies.mongo import get_collection
from integration.mongo.repository import ImageUploadRepository
from backend.models.schema import ImageUpload
from backend.models.response.api_response import APIResponse

image_router = APIRouter(prefix="/image")

@image_router.post(path="/upload")
async def upload_image_to_db(images: list[UploadFile], request: Request, collection: AsyncCollection = Depends(get_collection)):

    image_upload_data = [
        ImageUpload(
            image_file_name=image.filename,
            image_data=Binary(data=await image.read()),
            content_type=image.content_type,
        ) for image in images
    ]

    try:
        result = await ImageUploadRepository.insert_many(collection=collection, data=image_upload_data)

        return JSONResponse(
            content=APIResponse(
                message="Image uploaded successfully to the database",
            ).model_dump(by_alias=True),
            status_code=201
        )

    except Exception as e:
        return JSONResponse(
            content=APIResponse(
                message=f"Unexpected error while inserting into collection '{collection.name}'",
                errors=list(e)
            ).model_dump(by_alias=True),
            status_code=500
        )
