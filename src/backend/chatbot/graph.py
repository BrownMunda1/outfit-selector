from langgraph.graph import StateGraph, START, END
from langgraph.graph.state import CompiledStateGraph
from langgraph.checkpoint.memory import MemorySaver

from chatbot.state import ChatState
from utils.llm import LLM

_global_checkpointer = MemorySaver()
_global_graph = None

class ChatbotGraph:

    MODEL_NODE = "model"

    def __init__(self):
        graph = StateGraph(ChatState)
        graph.add_node(self.MODEL_NODE, self.model)
        graph.add_edge(START, self.MODEL_NODE)
        graph.add_edge(self.MODEL_NODE, END)
        self.compiled_graph = graph.compile(checkpointer=_global_checkpointer)

    async def model(self, state: ChatState):

        response = LLM(chat=True).invoke(state["messages"])
        return {
            "messages": response
        }

def get_graph() -> CompiledStateGraph:
    global _global_graph
    if _global_graph is None:
        graph_instance = ChatbotGraph()
        _global_graph = graph_instance.compiled_graph
    return _global_graph
