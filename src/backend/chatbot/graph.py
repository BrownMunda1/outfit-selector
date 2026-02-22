from __future__ import annotations

__all__ = [
    "graph"
]

from typing import TypedDict, Annotated

import requests
from langgraph.graph import StateGraph, add_messages

graph = StateGraph()

class ChatState(TypedDict):
    messages: Annotated[str, add_messages]

def init(state: ChatState):

    response = requests.get(
        url="/image/all"
    )
    result: list[dict] = response.raw

    all_images_ascii = [
        res.get("imageData")
        for res in result
    ]

    return all_images_ascii
