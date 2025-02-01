from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "[YOUR_PROJECT_NAME]"
    API_V1_STR: str = "[YOUR_API_PREFIX]"
    SECRET_KEY: str = "[YOUR_SECURE_SECRET_KEY]"  # Generate a secure random key for production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = "[YOUR_TOKEN_EXPIRY]"  # Recommended: 30-60 minutes
    MYSQL_SERVER: str = "[YOUR_MYSQL_HOST]"
    MYSQL_USER: str = "[YOUR_MYSQL_USERNAME]"
    MYSQL_PASSWORD: str = "[YOUR_MYSQL_PASSWORD]"
    MYSQL_DB: str = "[YOUR_DATABASE_NAME]"
    MYSQL_PORT: str = "[YOUR_MYSQL_PORT]"
    
    class Config:
        env_file = ".env"

settings = Settings()
