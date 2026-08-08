import json
from pathlib import Path
from typing import Any


# app/data/questions.json
QUESTIONS_FILE = (
    Path(__file__).resolve().parent.parent / "data" / "questions.json"
)


def load_questions() -> dict[str, list[dict[str, Any]]]:
    """Load interview questions from questions.json."""

    if not QUESTIONS_FILE.exists():
        raise FileNotFoundError(
            f"Questions file not found: {QUESTIONS_FILE}"
        )

    with QUESTIONS_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def get_questions_for_day(day: int) -> list[dict[str, Any]]:
    """Return all questions for a curriculum day."""

    questions = load_questions()

    return questions.get(str(day), [])


def get_question(day: int, question_index: int) -> dict[str, Any] | None:
    """Return one question for a specific curriculum day."""

    day_questions = get_questions_for_day(day)

    if question_index < 0 or question_index >= len(day_questions):
        return None

    return day_questions[question_index]