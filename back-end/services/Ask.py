from langchain_chroma import Chroma
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

from utility.config import MODEL, PROMPT_TEMPLATE
from utility.embedding import get_embedder
from utility.db import get_chroma_client




class ASK:
    def __init__(self, collection_name):
        self.client = get_chroma_client()
        self.llm = OllamaLLM(model=MODEL, temperature=0.3, top_k=50)
        self.embedder = get_embedder()
        self.prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

        self.collection = Chroma(
            client=self.client,
            collection_name=collection_name,
            embedding_function=self.embedder,
        )

    def format_history(self, history: list[dict]) -> str:
        """Formats the chat history into a string for the prompt."""
        if not history:
            return "No conversation history yet."

        formatted = []
        for msg in history:
            role = "User" if msg.get("sender") == "user" else "Assistant"
            formatted.append(f"{role}: {msg.get('message', '')}")
        return "\n".join(formatted)

    def ask(self, question: str, history: list[dict] = None):
        results = self.collection.similarity_search_with_score(question, k=5)
        context = "\n\n---\n\n".join([doc.page_content for doc, _ in results])
        formatted_history = self.format_history(history)

        prompt = self.prompt_template.format(
            context=context, question=question, history=formatted_history
        )
        response = self.llm.invoke(prompt)
        sources = [doc.metadata.get("id") for doc, _ in results]
        return response, sources

    def stream_ask(self, question: str, history: list[dict] = None):
        results = self.collection.similarity_search_with_score(question, k=5)
        context = "\n\n---\n\n".join([doc.page_content for doc, _ in results])
        formatted_history = self.format_history(history)

        prompt = self.prompt_template.format(
            context=context, question=question, history=formatted_history
        )
        sources = [doc.metadata.get("id") for doc, _ in results]

        for chunk in self.llm.stream(prompt):
            yield chunk

        yield f"\n\n [SOURCE] {', '.join(sources)}\n"
