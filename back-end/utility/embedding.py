from langchain_ollama import OllamaEmbeddings
from utility.config import EMBED_MODEL


def get_embedder():
    return OllamaEmbeddings(model=EMBED_MODEL)
