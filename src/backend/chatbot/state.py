from typing import Annotated, TypedDict, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph import add_messages

class ChatState(TypedDict):
    image_data: list[dict]
    messages: Annotated[Sequence[BaseMessage], add_messages]
