import os

from .config import AVAILABLE, PATH

def get_extension(name: str) -> str:
    if name.startswith("https") or name.startswith("http://"):
        return "url"
    return os.path.splitext(name)[1][1:].lower()


def check_resource_exists(source: str):
    ext = get_extension(source)

    if ext not in AVAILABLE:
        return False

    if ext == "url":
        return source

    full_source_path = os.path.join(PATH, source)

    if not os.path.isfile(full_source_path):
        return False
    

    return full_source_path
