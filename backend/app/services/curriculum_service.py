import json
from pathlib import Path


CURRICULUM_PATH = Path(__file__).resolve().parent.parent / "data" / "curriculum.json"


def load_curriculum():
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def get_day(day_number: int):
    curriculum = load_curriculum()

    for day in curriculum.get("days", []):
        if day.get("day") == day_number:
            return day

    return None


def get_module(day_number: int):
    curriculum = load_curriculum()

    for module in curriculum.get("modules", []):
        days = module.get("days", [])

        if len(days) == 2 and days[0] <= day_number <= days[1]:
            return module

    return None


def get_candidate_skills(candidate: dict):
    skills = []

    for mission in candidate.get("missions", []):
        if mission.get("passed") is True:
            skills.append({
                "day": mission.get("day"),
                "title": mission.get("title"),
                "attempts": mission.get("attempts", 0)
            })

    return skills


def get_candidate_gaps(candidate: dict):
    gaps = []

    for mission in candidate.get("missions", []):
        if mission.get("passed") is False or mission.get("skipped") is True:
            gaps.append({
                "day": mission.get("day"),
                "title": mission.get("title"),
                "status": "skipped" if mission.get("skipped") else "failed"
            })

    return gaps