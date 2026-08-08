import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.models.interview import (
    InterviewRequest,
    InterviewResponse,
    Feedback,
)

from app.services.interview_service import (
    create_session,
    save_answer,
    complete_session,
    get_session,
)

from app.services.question_service import get_question
from app.services.evaluation_service import evaluate_answer
from app.services.result_service import generate_final_result

router = APIRouter(
    prefix="/interview",
    tags=["Interview"],
)

DATA_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "curriculum.json"
)


def load_curriculum():
    if not DATA_PATH.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Curriculum file not found: {DATA_PATH}",
        )

    try:
        with open(DATA_PATH, "r", encoding="utf-8") as file:
            return json.load(file)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="curriculum.json contains invalid JSON",
        )


def get_interview_questions():
    curriculum = load_curriculum()

    questions = []

    for day_data in curriculum.get("days", []):
        day_number = day_data.get("day")

        if day_number is None:
            continue

        question_index = 0

        while True:
            question = get_question(
                day_number,
                question_index,
            )

            if question is None:
                break

            questions.append(
                {
                    "day": day_number,
                    "title": day_data.get("title", ""),
                    "type": day_data.get("type", ""),
                    "tools": day_data.get("tools", []),
                    "objectives": day_data.get("objectives", []),
                    "question": question.get("question", ""),
                    "difficulty": question.get(
                        "difficulty",
                        "medium",
                    ),
                    "question_type": question.get(
                        "type",
                        "technical",
                    ),
                }
            )

            question_index += 1

    return questions


@router.post(
    "",
    response_model=InterviewResponse,
)
async def interview_api(
    request: InterviewRequest,
):
    questions = get_interview_questions()

    total_questions = len(questions)

    if total_questions == 0:
        return InterviewResponse(
            reply="No interview questions are available in the curriculum.",
            done=True,
            feedback=Feedback(
                summary=(
                    "The interview could not start because "
                    "no questions were found."
                ),
                strengths=[],
                gaps=["No interview questions were loaded."],
                next=[
                    "Add questions to app/data/questions.json."
                ],
            ),
            questionIndex=0,
            totalQuestions=0,
            score=None,
        )

    question_index = max(
        getattr(
            request,
            "questionIndex",
            0,
        ),
        0,
    )

    if question_index >= total_questions:
        await complete_session(
            request.sessionId
        )

        final_result = await generate_final_result(
            request.sessionId
        )

        if final_result:
            summary = final_result.get(
                "summary",
                "The candidate completed the interview.",
            )

            strengths = final_result.get(
                "strengths",
                [],
            )

            gaps = final_result.get(
                "gaps",
                [],
            )

            recommendations = final_result.get(
                "recommendations",
                [],
            )
        else:
            summary = (
                "The candidate completed "
                "the interview."
            )
            strengths = [
                "Completed the full interview."
            ]
            gaps = []
            recommendations = [
                "Review the final interview results."
            ]

        return InterviewResponse(
            reply="The interview has been completed.",
            done=True,
            feedback=Feedback(
                summary=summary,
                strengths=strengths,
                gaps=gaps,
                next=recommendations,
            ),
            questionIndex=total_questions,
            totalQuestions=total_questions,
            score=None,
        )

    current_question = questions[
        question_index
    ]

    if (
        request.candidate is not None
        and request.message is None
    ):
        await create_session(
            request.sessionId,
            request.candidate.model_dump(),
        )

    if (
        request.message is None
        or not request.message.strip()
    ):
        return InterviewResponse(
            reply=current_question["question"],
            done=False,
            feedback=Feedback(
                summary=(
                    f"Day {current_question['day']}: "
                    f"{current_question['title']}"
                ),
                strengths=[],
                gaps=[],
                next=[
                    "Answer the interview question."
                ],
            ),
            questionIndex=question_index,
            totalQuestions=total_questions,
            score=None,
        )

    session = await get_session(
        request.sessionId
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Interview session not found. "
                "Start the interview first."
            ),
        )

    evaluation = evaluate_answer(
        request.message,
        current_question,
    )

    score = evaluation["score"]
    level = evaluation["level"]
    matched_keywords = evaluation[
        "matched_keywords"
    ]

    strengths = []
    gaps = []
    next_steps = []

    if level == "strong":
        strengths.append(
            "Strong understanding of the topic."
        )

        if matched_keywords:
            strengths.append(
                "Relevant technical concepts "
                "were included in the answer."
            )

    elif level == "moderate":
        strengths.append(
            "The answer demonstrated some "
            "understanding of the topic."
        )

        gaps.append(
            "The answer could include more "
            "technical depth."
        )

        next_steps.append(
            "Include more technical concepts "
            "and practical examples."
        )

    else:
        gaps.append(
            "The answer needs stronger "
            "technical coverage."
        )

        next_steps.append(
            "Review the topic and explain it "
            "using relevant tools and examples."
        )

    if not next_steps:
        next_steps.append(
            "Continue with the next interview question."
        )

    feedback_data = {
        "summary": (
            f"Answer evaluated as {level} "
            f"with a score of {score}/3."
        ),
        "strengths": strengths,
        "gaps": gaps,
        "next": next_steps,
    }

    await save_answer(
        session_id=request.sessionId,
        question_index=question_index,
        question=current_question["question"],
        answer=request.message,
        score=score,
        feedback=feedback_data,
    )

    next_index = question_index + 1

    if next_index >= total_questions:
        await complete_session(
            request.sessionId
        )

        final_result = await generate_final_result(
            request.sessionId
        )

        if final_result:
            final_summary = final_result.get(
                "summary",
                "The candidate completed the interview.",
            )

            final_strengths = final_result.get(
                "strengths",
                [],
            )

            final_gaps = final_result.get(
                "gaps",
                [],
            )

            final_recommendations = final_result.get(
                "recommendations",
                [],
            )

            percentage = final_result.get(
                "percentage",
                0,
            )

            final_summary = (
                f"{final_summary} "
                f"Final score: {percentage}%."
            )

        else:
            final_summary = (
                "The candidate completed "
                "the final interview question."
            )

            final_strengths = strengths
            final_gaps = gaps
            final_recommendations = [
                "Review the final interview results."
            ]

        return InterviewResponse(
            reply=(
                "The interview is complete. "
                "Thank you for your responses."
            ),
            done=True,
            feedback=Feedback(
                summary=final_summary,
                strengths=final_strengths,
                gaps=final_gaps,
                next=final_recommendations,
            ),
            questionIndex=total_questions,
            totalQuestions=total_questions,
            score=score,
        )

    next_question = questions[
        next_index
    ]

    return InterviewResponse(
        reply=next_question["question"],
        done=False,
        feedback=Feedback(
            summary=(
                f"Answer evaluated as {level} "
                f"with a score of {score}/3."
            ),
            strengths=strengths,
            gaps=gaps,
            next=next_steps,
        ),
        questionIndex=next_index,
        totalQuestions=total_questions,
        score=score,
    )