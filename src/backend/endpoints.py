import base64
from bson.binary import Binary
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from fastapi import Depends
from fastapi.datastructures import UploadFile
from pymongo.asynchronous.collection import AsyncCollection

from integration.dependencies.mongo import get_collection
from integration.mongo.repository import ImageRepository
from backend.models.schema import ImageUpload
from backend.models.response.api_response import APIResponse

image_router = APIRouter(prefix="/image")

@image_router.post(path="/upload")
async def upload_image_to_db(images: list[UploadFile], request: Request, collection: AsyncCollection = Depends(get_collection)):

    image_upload_data = []
    for image in images:
        image_data = await image.read()
        image_data_encoded = base64.b64encode(image_data)

        image_upload_data.append(
            ImageUpload(
                image_file_name=image.filename,
                image_data=image_data_encoded,
                content_type=image.content_type,
            )
        )

    try:
        result = await ImageRepository.insert_many(collection=collection, data=image_upload_data)

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

@image_router.get("/all")
async def get_all_images(request: Request, collection: AsyncCollection = Depends(get_collection)):

    try:
        result = await ImageRepository.find_all(collection=collection)

        all_images: list[dict] = []

        async for document in result:
            doc: dict = document
            doc.pop("_id")
            all_images.append(doc)

        return all_images
    except Exception as e:
        return JSONResponse(
            content=APIResponse(
                message=f"Unexpected error while fetching images from collection '{collection.name}'",
                errors=list(e)
            ).model_dump(by_alias=True),
            status_code=500
        )
