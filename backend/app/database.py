from pymongo import AsyncMongoClient

from app.config import settings


client = AsyncMongoClient(settings.MONGO_URL)

database = client[settings.DATABASE_NAME]


async def connect_db():
    await client.admin.command("ping")
    print("MongoDB connected successfully")


async def close_db():
    await client.close()
    print("MongoDB connection closed")