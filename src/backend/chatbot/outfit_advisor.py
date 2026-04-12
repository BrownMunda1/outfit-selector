from __future__ import annotations

## Future scope: Enhance the chatbot part
# __all__ = [
#     "graph"
# ]

# from typing import TypedDict, Annotated
# from langgraph.graph import StateGraph, add_messages

# graph = StateGraph()

# class ChatState(TypedDict):
#     image_data: list
#     messages: Annotated[str, add_messages]

from langchain_core.messages import AIMessage

from integration.mongo.repository import GenericRepository
from integration.mongo.connection import AsyncMongoConnection
from common.constants import IMAGE_COLLECTION_NAME
from backend.utils.llm import LLM

async def init(user_info: dict) -> dict:
    print("here2")
    username = user_info.get("username")
    print("here-1")
    collection = await AsyncMongoConnection().get_collection(collection_name=IMAGE_COLLECTION_NAME)
    print("here3")
    all_images_data = await GenericRepository.find_by_user(collection=collection, username=username)
    print("here4")
    extracted_images_data = []
    for document in all_images_data:
        doc: dict = document
        doc.pop("_id")
        doc.pop("username")
        extracted_images_data.append(doc)

    print("extracted image data:", extracted_images_data)

    return {
        "image_data": extracted_images_data
    }

async def chat_response(user_info: dict, user_query: str):

    image_data = await init(user_info=user_info)

    system_prompt = f"""You are supposedly the world's greatest Outfit Advisor. Given a set of outfits and their descriptions, your task is to find the best possible outfit for the user's question, which is most likely to be one related to the outfits. Return the top 3 outfits from the given set of outfits. Give a reason of why you're providing the suggestion.
    The Outfit Information: {image_data}

    Question: {user_query}"""

    system_message_content = {
        "type": "text",
        "text": system_prompt
    }

    system_message: AIMessage = AIMessage(content=[system_message_content])

    response = LLM(chat=True).invoke(messages=[system_message])
    return response
