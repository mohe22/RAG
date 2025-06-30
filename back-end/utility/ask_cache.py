from services.Ask import ASK

ask_instance_cache = {}


def get_ask_instance(collection_name: str) -> ASK:
    if collection_name not in ask_instance_cache:
        print(f"[ASK INIT] Creating new ASK instance for: {collection_name}")
        ask_instance_cache[collection_name] = ASK(collection_name)
    else:
        print(f"[ASK CACHE] Reusing ASK instance for: {collection_name}")

    return ask_instance_cache[collection_name]
