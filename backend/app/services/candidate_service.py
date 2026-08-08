import json
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parents[2] / "hackathon_data"


def load_candidates():
    candidates_path = DATA_DIR / "candidates.json"

    with open(candidates_path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_candidates():
    return load_candidates()