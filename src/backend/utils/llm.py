from langchain.chat_models import init_chat_model

from backend.models.schema import ImageUpload

class LLM:
    def __init__(self):
        self.llm = init_chat_model("openai:gpt-4.1")
        self.llm = self.llm.with_structured_output(ImageUpload)
        pass

    def invoke(self, messages: list[dict]):
        try:
            response = self.llm.invoke(messages)
            return response
        except Exception as e:
            raise Exception(f"Error in LLM Call: {e}")
