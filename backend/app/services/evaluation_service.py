def evaluate_answer(answer, topic):
    answer_text = answer.lower()

    keywords = []

    for tool in topic.get("tools", []):
        keywords.append(tool.lower())

    for objective in topic.get("objectives", []):
        words = objective.lower().split()

        for word in words:
            cleaned = word.strip(".,()[]{}:;\"'")

            if len(cleaned) > 5:
                keywords.append(cleaned)

    matched = []

    for keyword in set(keywords):
        if keyword in answer_text:
            matched.append(keyword)

    if len(matched) >= 4:
        score = 3
        level = "strong"
    elif len(matched) >= 2:
        score = 2
        level = "moderate"
    elif len(matched) >= 1:
        score = 1
        level = "needs_improvement"
    else:
        score = 0
        level = "needs_improvement"

    return {
        "score": score,
        "level": level,
        "matched_keywords": matched
    }


def generate_feedback(evaluations, candidate):
    if not evaluations:
        return {
            "summary": "No interview responses were evaluated.",
            "strengths": [],
            "gaps": [],
            "next": []
        }

    total_score = sum(
        item["evaluation"]["score"]
        for item in evaluations
    )

    maximum_score = len(evaluations) * 3

    percentage = (
        total_score / maximum_score * 100
        if maximum_score > 0
        else 0
    )

    strengths = []
    gaps = []

    for item in evaluations:
        topic = item["topic"]
        result = item["evaluation"]

        if result["level"] == "strong":
            strengths.append(
                f"Strong understanding of {topic}."
            )

        elif result["level"] == "needs_improvement":
            gaps.append(
                f"Needs improvement in {topic}."
            )

    if percentage >= 75:
        summary = (
            f"{candidate['name']} demonstrated strong technical "
            f"understanding across the evaluated areas."
        )
    elif percentage >= 50:
        summary = (
            f"{candidate['name']} demonstrated moderate technical "
            f"understanding with some areas requiring improvement."
        )
    else:
        summary = (
            f"{candidate['name']} demonstrated foundational knowledge "
            f"but needs improvement across several technical areas."
        )

    next_steps = []

    for gap in gaps[:3]:
        topic = gap.replace(
            "Needs improvement in ",
            ""
        ).replace(".", "")

        next_steps.append(
            f"Practice more real-world questions related to {topic}."
        )

    if not next_steps:
        next_steps.append(
            "Continue practicing advanced real-world technical scenarios."
        )

    return {
        "summary": summary,
        "strengths": strengths[:5],
        "gaps": gaps[:5],
        "next": next_steps[:5]
    }