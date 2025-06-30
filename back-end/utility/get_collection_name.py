import os
import re
from urllib.parse import urlparse, unquote

# https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-samr/4df07fab-1bbc-452f-8e92-7853a3c7e380
# learn.microsoft.com_en-us_openspecs_windows_protocols_ms-samr_4df07fab-1bbc-452f-8e92-7853a3c7e380


def get_collection_name(source: str) -> str:
    if source.startswith("http"):
        parsed = urlparse(source)
        # Decode URL-encoded characters (e.g., %2B => +)
        full_path = unquote(f"{parsed.netloc}{parsed.path}")
        # Replace non-allowed characters with underscores
        name = re.sub(r"[^a-zA-Z0-9._-]", "_", full_path)
        # Ensure it starts and ends with alphanumeric character
        name = re.sub(r"^[^a-zA-Z0-9]+", "", name)
        name = re.sub(r"[^a-zA-Z0-9]+$", "", name)
        # Ensure length requirement
        return name[:512] if len(name) > 512 else name
    else:
        base = os.path.splitext(os.path.basename(source))[0]
        name = re.sub(r"[^a-zA-Z0-9._-]", "_", base)
        name = re.sub(r"^[^a-zA-Z0-9]+", "", name)
        name = re.sub(r"[^a-zA-Z0-9]+$", "", name)
        return name[:512] if len(name) > 512 else name
