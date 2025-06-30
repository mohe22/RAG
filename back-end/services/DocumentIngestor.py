# splitters
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
    RecursiveJsonSplitter,
)

# loaders
from langchain_community.document_loaders import (
    PyPDFLoader,
    CSVLoader,
    JSONLoader,
    TextLoader,
)
from langchain_unstructured import UnstructuredLoader

# db
from utility.db import  get_chroma_client
from utility.embedding import get_embedder

# hlpers
from utility.get_extension import get_extension
import datetime
from utility.get_collection_name import get_collection_name


class DocumentIngestor:
    def __init__(self, source):
        self.source = source
        self.extension = get_extension(source)
        self.db = get_chroma_client()
        self.collection_name = get_collection_name(source)
        self.raw_docs=[]

    def _load_data(self):
        is_url = self.extension == "url"
        if is_url:
            # Load webpage or online content using UnstructuredLoader
            loader = UnstructuredLoader(web_url=self.source)
            self.raw_docs = loader.load()
        else:
            # Load local files based on extension
            if self.extension == "pdf":
                loader = PyPDFLoader(self.source)
                self.raw_docs = loader.load()
            elif self.extension == "csv":
                loader = CSVLoader(self.source)
                self.raw_docs = loader.load()
            elif self.extension == "json":
                loader = JSONLoader(self.source)

                self.raw_docs = loader.load()
            elif self.extension in ["txt", "md"]:
                loader = TextLoader(self.source)
                self.raw_docs = loader.load()
            else:
                raise ValueError(f"Unsupported file extension: {self.extension}")

        return self.raw_docs

    def _split(self):

        if not self.raw_docs:
            raise ValueError("No documents to split. Call load_data() first.")
        if self.extension == "json":
            splitter = RecursiveJsonSplitter()
        elif self.extension == "csv":
            splitter = CharacterTextSplitter(chunk_size=768, chunk_overlap=100)
        elif self.extension in ["txt", "md", "pdf"] or self.source.startswith("http"):
            splitter = RecursiveCharacterTextSplitter(chunk_size=768, chunk_overlap=100)
        else:
            raise ValueError(f"Unsupported extension for splitting: {self.extension}")

        chunks = splitter.split_documents(self.raw_docs)
        return chunks

    def _assign_ids(self,chunks):

        if not chunks:
            raise ValueError("Chunks not found. Call _split() first.")
        for idx, doc in enumerate(chunks):
            src = doc.metadata.get("source") or doc.metadata.get("url") or "unknown"
            page = doc.metadata.get("page", 0)
            key = f"{src}_{page}"

            doc.metadata["id"] = f"{key}:{idx}"
            #  Clean metadata to prevent ChromaDB type errors
            doc.metadata = {
                k: v if isinstance(v, (str, int, float, bool, type(None))) else str(v)
                for k, v in doc.metadata.items()
            }

    def load(self):
        self._load_data()
        chunks=self._split()
        self._assign_ids(chunks)
        self._add_to_db(chunks)

        return self.collection_name

    def _add_to_db(self,chunks):
        if not chunks:
            raise ValueError("No chunks to insert. Run load_data and _split first.")
            # Check if collection exists
        collections = self.db.list_collections()
        collection_names = [c.name for c in collections]
        # Create or get collection
        if self.collection_name in collection_names:
            collection = self.db.get_collection(self.collection_name)
        else:
            metadata = {
                "type": self.extension,
                "createdAt": datetime.datetime.utcnow().isoformat(),
            }
            collection = self.db.create_collection(
                name=self.collection_name, metadata=metadata
            )

        # Filter out already existing IDs
        existing_ids = set(collection.get()["ids"])
        new_docs = [doc for doc in chunks if doc.metadata.get("id") not in existing_ids]

        # Directly add Document objects — Chroma supports it via LangChain integration
        if new_docs:
            texts = [doc.page_content for doc in new_docs]
            embedder = get_embedder()
            vectors = embedder.embed_documents(texts)

            collection.add(
                documents=texts,
                embeddings=vectors,
                metadatas=[doc.metadata for doc in new_docs],
                ids=[doc.metadata["id"] for doc in new_docs],
            )
