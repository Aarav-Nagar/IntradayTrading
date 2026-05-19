from __future__ import annotations

import os


class Settings:
    storage_provider = os.getenv("APP_STORAGE_PROVIDER", "demo").lower()
    mongodb_uri = os.getenv("MONGODB_URI", "")
    mongodb_database = os.getenv("MONGODB_DATABASE", "options_risk_check")
    clerk_secret_key = os.getenv("CLERK_SECRET_KEY", "")
    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    sentry_dsn = os.getenv("SENTRY_DSN", "")
    environment = os.getenv("APP_ENV", "development")


settings = Settings()
