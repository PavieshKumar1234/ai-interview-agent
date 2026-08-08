
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import connect_db, close_db
from app.api.interview import router as interview_router
from app.api.result import router as result_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()

    yield

    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the AI Interview Agent",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "AI Interview Agent API is running",
        "status": "success",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "AI Interview Agent Backend",
    }


app.include_router(
    interview_router,
    prefix="/api",
)

app.include_router(
    result_router,
    prefix="/api",
)
