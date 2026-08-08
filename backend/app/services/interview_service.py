from datetime import datetime, timezone

from app.database import database


async def create_session(session_id, candidate):
    session = {
        "sessionId": session_id,
        "candidate": candidate,
        "answers": [],
        "status": "IN_PROGRESS",
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }

    await database.interview_sessions.update_one(
        {"sessionId": session_id},
        {"$setOnInsert": session},
        upsert=True
    )

    return session


async def save_answer(
    session_id,
    question_index,
    question,
    answer,
    score,
    feedback
):
    answer_data = {
        "questionIndex": question_index,
        "question": question,
        "answer": answer,
        "score": score,
        "feedback": feedback,
        "createdAt": datetime.now(timezone.utc)
    }

    await database.interview_sessions.update_one(
        {"sessionId": session_id},
        {
            "$push": {
                "answers": answer_data
            },
            "$set": {
                "updatedAt": datetime.now(timezone.utc)
            }
        }
    )


async def complete_session(session_id):
    await database.interview_sessions.update_one(
        {"sessionId": session_id},
        {
            "$set": {
                "status": "COMPLETED",
                "updatedAt": datetime.now(timezone.utc)
            }
        }
    )


async def get_session(session_id):
    return await database.interview_sessions.find_one(
        {"sessionId": session_id}
    )