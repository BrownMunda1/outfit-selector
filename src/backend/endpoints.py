from fastapi.requests import Request
from fastapi.routing import APIRouter
from fastapi import UploadFile

image_router = APIRouter(prefix="/image")

@image_router.post(path="/upload")
async def upload_image_to_db(image: UploadFile):

    image_bytes = await image.read()
    # save this shit to the database (mongodb only as of now)
