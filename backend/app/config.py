from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "AI Interview Agent"
    DEBUG: bool = True

    MONGO_URL: str
    DATABASE_NAME: str = "ai_interview_agent"

    AI_API_KEY: str = ""
    AI_MODEL: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()