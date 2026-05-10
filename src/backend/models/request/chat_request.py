from pydantic import BaseModel, Field

class ChatStreamRequest(BaseModel):

    message: str = Field(
        description="The user message from the chat"
    )
    chat_thread_id: str | None = Field(
        default=None,
        description="The thread ID associated with the chat of that particular user"
    )
