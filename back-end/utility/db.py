from chromadb import PersistentClient 
from .config import CHROMA_PATH
from chromadb.config import Settings

# Native ChromaDB client
chroma_client = PersistentClient(
    path=CHROMA_PATH,
    settings=Settings(anonymized_telemetry=False, allow_reset=True),
)


def get_chroma_client():
    return chroma_client
