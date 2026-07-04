import os
import json
from uuid import uuid4

from fastapi import HTTPException
from langchain.messages import AIMessageChunk, HumanMessage
from langchain_core.messages import SystemMessage
from langgraph.graph.state import CompiledStateGraph

from integration.mongo.repository import GenericRepository
from integration.mongo.connection import AsyncMongoConnection
from common.constants import IMAGE_COLLECTION_NAME
from chatbot.graph import get_graph

# async def init(user_info: dict) -> dict: # Starting node
#     username = user_info.get("username")
#     collection = await AsyncMongoConnection().get_collection(collection_name=IMAGE_COLLECTION_NAME)
#     all_images_data = await GenericRepository.find_by_user(collection=collection, username=username)
#     extracted_images_data = []
#     for document in all_images_data:
#         doc: dict = document
#         doc.pop("_id")
#         doc.pop("username")
#         extracted_images_data.append(doc)

#     return {
#         "image_data": extracted_images_data
#     }

# async def chat_response(user_info: dict, user_query: str):

#     image_data = await init(user_info=user_info)

#     system_prompt = f"""You are supposedly the world's greatest Outfit Advisor. Given a set of outfits and their descriptions, your task is to find the best possible outfit for the user's question, which is most likely to be one related to the outfits. Return the top 3 outfits from the given set of outfits. Give a reason of why you're providing the suggestion.
#     The Outfit Information: {image_data}

#     Question: {user_query}"""

#     system_message_content = {
#         "type": "text",
#         "text": system_prompt
#     }

#     system_message: AIMessage = AIMessage(content=[system_message_content])

#     response = LLM(chat=True).invoke(messages=[system_message])
#     return response


class ChatbotOrchestrator:

    INIT_NODE = "init"
    MODEL_NODE = "chat_response"

    def __init__(self, user_info: dict):
        self.user_info = user_info
        self.graph: CompiledStateGraph = get_graph()

    async def get_system_message(self) -> SystemMessage:
        image_data = await self._init()

        system_prompt = f"""You are supposedly the world's greatest Outfit Advisor. Given a set of outfits and their descriptions, your task is to find the best possible outfit for the user's question, which is most likely to be one related to the outfits. Return the top 3 outfits from the given set of outfits. Give a reason of why you're providing the suggestion. The Outfit Information:
        {image_data}"""

        system_message: SystemMessage = SystemMessage(content=system_prompt)
        print("system message ready")
        return system_message

    async def _init(self):
        username = self.user_info.get("username")
        collection = await AsyncMongoConnection().get_collection(
            collection_name=os.getenv(IMAGE_COLLECTION_NAME)
        )
        all_images_data = await GenericRepository.find_by_user(
            collection=collection, username=username
        )
        extracted_images_data: list[dict] = []
        for document in all_images_data:
            doc: dict = document
            doc.pop("_id")
            doc.pop("username")
            extracted_images_data.append(doc)

        return {"image_data": extracted_images_data}

    async def invoke(self, user_query: str, chat_thread_id: str | None):

        username = self.user_info.get("username")

        if chat_thread_id is None:

            new_chat_thread_id = f"{self.generate_chat_id()}:{username}"
            chat_config = {"configurable": {"thread_id": new_chat_thread_id}}
            print("chat thread id ready")
            system_message = await self.get_system_message()

            events = self.graph.astream_events(
                {"messages": [system_message, HumanMessage(content=user_query)]},
                version="v2",
                config=chat_config,
            )
            print("events ready")

            yield f"data: {json.dumps(
                {
                    "type": "checkpoint",
                    "chat_thread_id": new_chat_thread_id
                }
            )}\n\n"

        else:

            if not chat_thread_id.endswith(f":{username}"):
                raise HTTPException(
                    status_code=403, detail="This thread ID doesn't belong to this user"
                )

            chat_config = {"configurable": {"thread_id": chat_thread_id}}
            events = self.graph.astream_events(
                {"messages": [HumanMessage(content=user_query)]},
                version="v2",
                config=chat_config,
            )

        async for chunk in events:
            # print("iterating chunks")
            kind = chunk["event"]

            if kind == "on_chat_model_stream":
                chunk_message: AIMessageChunk = chunk["data"]["chunk"]
                content = chunk_message.content

                ## SSE Format for FastAPI to Frontend communication
                if content:
                    yield f"data: {json.dumps(
                        {
                            "type": "content",
                            "content": content
                        }
                    )}\n\n"

    def generate_chat_id(self) -> str:
        return str(uuid4())
