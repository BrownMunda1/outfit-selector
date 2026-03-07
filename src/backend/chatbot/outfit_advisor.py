from __future__ import annotations

# __all__ = [
#     "graph"
# ]

# from typing import TypedDict, Annotated

# from langgraph.graph import StateGraph, add_messages

from integration.mongo.repository import ImageRepository
from integration.mongo.connection import AsyncMongoConnection
from common.constants import IMAGE_COLLECTION_NAME
from utils.llm import LLM

# graph = StateGraph()

# class ChatState(TypedDict):
#     image_data: list
#     messages: Annotated[str, add_messages]

def init() -> dict:

    # response = requests.get(
    #     url="/image/all"
    # )
    # result: list[dict] = response.raw

    # all_images_ascii = [
    #     res.get("imageData")
    #     for res in result
    # ]

    # return all_images_ascii


    collection = AsyncMongoConnection().get_collection(collection_name=IMAGE_COLLECTION_NAME)
    all_images_data = ImageRepository.find_all(collection=collection)

    return {
        "image_data": all_images_data
    }

def chat_response(user_query: str):

    image_data = init()

    system_prompt = f"""You are supposedly the world's greatest Outfit Advisor. Given a set of outfits and their descriptions, your task is to find the best possible outfit for the user's question, which is most likely to be one related to the outfits. Return the top 3 outfits from the given set of outfits. Give a reason of why you're providing the suggestion.
    The Outfit Information: {image_data}

    Question: {user_query}"""

    system_message = {
        "type": "text",
        "text": system_prompt
    }

    response = LLM.invoke([system_message])
    return response
