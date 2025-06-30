from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from utility.ask_cache import get_ask_instance

from services.DocumentIngestor import DocumentIngestor
from utility.db import get_chroma_client


# helpers
from utility.check_resource_exists import  check_resource_exists
from utility.db import get_chroma_client


router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatGroupCreateRequest(BaseModel):
    source: str


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


@router.delete("/{id}")
async def chat_endpoint(
    id: str = Path(..., description="The project or file ID"),
):
    try:

        db = get_chroma_client()
        db.delete_collection(name=id)
        return "Deleted"
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/message/{id}")
async def chat_endpoint(
    body: ChatRequest,
    id: str = Path(..., description="The project or file ID"),
):
    try:
        chat = get_ask_instance(id)
        stream = chat.stream_ask(body.message, body.history)
        return StreamingResponse(stream, media_type="text/plain")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all-chats")
def list_all_chats():
    try:
        db = get_chroma_client()
        collections = db.list_collections()
        return [
            {
                "name": c.name,
                "metadata": c.metadata,
            }
            for c in collections
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/new-chat/")
def create_chat_group(data: ChatGroupCreateRequest):
    try:
        chat_name = check_resource_exists(data.source)
        if not chat_name:
            raise HTTPException(status_code=404, detail=f"File not found: {data.source}")
        loaded = DocumentIngestor(source=chat_name).load()


        return loaded
    except HTTPException as f:
        print(f)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
