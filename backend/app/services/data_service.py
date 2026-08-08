import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"

CANDIDATES_FILE = DATA_DIR / "candidates.json"
CURRICULUM_FILE = DATA_DIR / "curriculum.json"


def load_candidates():
    with open(CANDIDATES_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def load_curriculum():
    with open(CURRICULUM_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_candidate(candidate_id):
    data = load_candidates()

    for candidate in data.get("candidates", []):
        member = candidate.get("member", {})

        if member.get("id") == candidate_id:
            return candidate

    return None


def get_day(day_number):
    data = load_curriculum()

    for day in data.get("days", []):
        if day.get("day") == day_number:
            return day

    return None


def get_curriculum():
    return load_curriculum()