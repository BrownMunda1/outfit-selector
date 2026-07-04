import io
import os
import base64

from dotenv import load_dotenv
from PIL import Image
from langchain.messages import HumanMessage
from fastapi.datastructures import UploadFile

from utils.llm import LLM
from common.constants import IMAGE_COLLECTION_NAME
from integration.mongo.connection import AsyncMongoConnection
from integration.mongo.repository import GenericRepository


class ImageProcessor:

    def __init__(self):
        pass

    async def process_images(self, user, images: list[UploadFile]):
        images_data: list = []
        for image in images:
            image_data = await image.read()
            image_data = self.process_image(image=image_data)
            image_data.username = user["username"]
            image_data.gender = user["gender"]
            images_data.append(image_data)

        # Push to mongodb
        collection = await AsyncMongoConnection().get_collection(
            collection_name=os.getenv(IMAGE_COLLECTION_NAME)
        )

        result = await GenericRepository.insert_many(
            collection=collection, data=images_data
        )

        return result

    def process_image(self, image: bytes):
        image_base64 = self._convert_image_to_base64(image=image)
        llm_prompt = self._prepare_content_for_llm_prompt(image_base64=image_base64)
        response = LLM().invoke(messages=[llm_prompt])
        return response

    def _convert_image_to_base64(self, image: bytes):
        pil_image = Image.open(io.BytesIO(image)).convert("RGB")
        buffered = io.BytesIO()
        pil_image.save(buffered, format="PNG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode()
        return image_base64

    def _prepare_content_for_llm_prompt(self, image_base64):
        content = []
        content.append(
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{image_base64}"},
            }
        )

        content.append(
            {
                "type": "text",
                "text": "Extract the clothing details from the provided image. Details should include the colour, the type of clothing (whether it is a shirt, t-shirt, crop top, baggy jeans, normal jeans etc), the texture and accessories (like rings, necklaces) if any.",
            }
        )

        return HumanMessage(content=content)
