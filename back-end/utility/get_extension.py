import os 
def get_extension(name: str) -> str:
    if name.startswith("https"):
        return "url"
    return os.path.splitext(name)[1][1:].lower()
