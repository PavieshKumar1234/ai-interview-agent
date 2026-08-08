from fastapi import APIRouter, HTTPException

from app.services.result_service import generate_final_result

router = APIRouter(
    prefix="/result",
    tags=["Result"],
)


@router.get("/{session_id}")
async def get_final_result(session_id: str):
    result = await generate_final_result(session_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    return result