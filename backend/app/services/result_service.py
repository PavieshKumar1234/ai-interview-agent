from app.services.interview_service import get_session

async def generate_final_result(session_id: str):
    session = await get_session(session_id)

    if session is None:
        return None

    answers = session.get("answers", [])

    if not answers:
        return {
            "total_questions": 0,
            "answered_questions": 0,
            "total_score": 0,
            "maximum_score": 0,
            "percentage": 0,
            "strengths": [],
            "gaps": [],
            "recommendations": [],
            "summary": "No interview answers were recorded.",
        }

    total_score = 0
    maximum_score = len(answers) * 3

    strengths = []
    gaps = []

    for item in answers:
        total_score += item.get("score", 0)

        feedback = item.get("feedback", {})

        for strength in feedback.get("strengths", []):
            if strength not in strengths:
                strengths.append(strength)

        for gap in feedback.get("gaps", []):
            if gap not in gaps:
                gaps.append(gap)

    percentage = (
        total_score / maximum_score * 100
        if maximum_score > 0
        else 0
    )

    if percentage >= 80:
        summary = "Excellent technical performance."

    elif percentage >= 60:
        summary = "Good technical performance with some areas for improvement."

    elif percentage >= 40:
        summary = "Moderate performance with room for improvement."

    else:
        summary = "The candidate needs significant improvement."

    recommendations = []

    for gap in gaps[:5]:
        recommendations.append(
            f"Practice questions related to: {gap}"
        )

    if not recommendations:
        recommendations.append(
            "Continue practicing advanced technical interview questions."
        )

    return {
        "total_questions": len(answers),
        "answered_questions": len(answers),
        "total_score": total_score,
        "maximum_score": maximum_score,
        "percentage": round(percentage, 2),
        "strengths": strengths[:10],
        "gaps": gaps[:10],
        "recommendations": recommendations[:10],
        "summary": summary,
    }