from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timezone
from typing import Any

from api.settings import settings


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def make_id(prefix: str) -> str:
    return f"{prefix}_{secrets.token_hex(8)}"


def clean_email(email: str) -> str:
    return email.strip().lower()


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    next_salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), next_salt.encode("utf-8"), 120_000)
    return digest.hex(), next_salt


def profile_from_signup(payload: Any) -> dict[str, Any]:
    return {
        "accountSize": float(payload.accountSize),
        "riskBudgetPercent": float(payload.riskBudgetPercent),
        "purpose": payload.purpose,
        "tradeFocus": payload.tradeFocus,
        "experienceLevel": payload.experienceLevel,
        "riskStyle": payload.riskStyle,
        "struggles": payload.struggles,
        "reminders": payload.reminders,
        "sectors": payload.sectors,
        "marketCaps": payload.marketCaps,
        "events": payload.events,
        "safetyAccepted": bool(payload.safetyAccepted),
    }


class DemoStore:
    """Development-only in-memory store. No user data is persisted to disk."""

    def __init__(self) -> None:
        self.users: dict[str, dict[str, Any]] = {}
        self.users_by_email: dict[str, str] = {}
        self.trade_checks: dict[str, dict[str, Any]] = {}
        self.journal_by_user: dict[str, list[dict[str, Any]]] = {}
        self.chat_threads: dict[str, dict[str, Any]] = {}
        self.chat_messages: dict[str, list[dict[str, Any]]] = {}

    def create_user(self, payload: Any) -> dict[str, Any]:
        email = clean_email(payload.email)
        if email in self.users_by_email:
            raise ValueError("An account with this email already exists.")
        password_hash, salt = hash_password(payload.password)
        user = {
            "id": make_id("user"),
            "name": payload.name.strip(),
            "email": email,
            **profile_from_signup(payload),
            "createdAt": utc_now(),
        }
        self.users[user["id"]] = {**user, "passwordHash": password_hash, "salt": salt}
        self.users_by_email[email] = user["id"]
        return user

    def sign_in(self, email: str, password: str) -> dict[str, Any]:
        user_id = self.users_by_email.get(clean_email(email))
        if not user_id:
            raise ValueError("Email or password did not match an account.")
        record = self.users[user_id]
        password_hash, _salt = hash_password(password, record["salt"])
        if password_hash != record["passwordHash"]:
            raise ValueError("Email or password did not match an account.")
        return public_user(record)

    def find_user_by_email(self, email: str) -> dict[str, Any] | None:
        user_id = self.users_by_email.get(clean_email(email))
        return public_user(self.users[user_id]) if user_id else None

    def save_trade_check(self, user_id: str | None, request: dict[str, Any], response: dict[str, Any]) -> None:
        self.trade_checks[response["id"]] = {
            "id": response["id"],
            "userId": user_id,
            "request": request,
            "response": response,
            "createdAt": utc_now(),
        }

    def save_journal_entry(self, user_id: str, trade_check_id: str | None, entry: dict[str, Any]) -> dict[str, Any]:
        item = {"id": make_id("journal"), "tradeCheckId": trade_check_id, **entry, "createdAt": utc_now()}
        self.journal_by_user.setdefault(user_id, []).insert(0, item)
        return item

    def list_journal_entries(self, user_id: str) -> list[dict[str, Any]]:
        return self.journal_by_user.get(user_id, [])

    def append_chat(self, user_id: str, thread_id: str | None, user_message: str, assistant_message: str) -> str:
        next_thread_id = thread_id or make_id("thread")
        self.chat_threads.setdefault(next_thread_id, {"id": next_thread_id, "userId": user_id, "title": user_message[:48], "createdAt": utc_now()})
        self.chat_messages.setdefault(next_thread_id, []).extend(
            [
                {"id": make_id("msg"), "role": "user", "content": user_message, "createdAt": utc_now()},
                {"id": make_id("msg"), "role": "assistant", "content": assistant_message, "createdAt": utc_now()},
            ]
        )
        return next_thread_id


class MongoStore(DemoStore):
    """MongoDB Atlas storage adapter with the same interface as DemoStore."""

    def __init__(self) -> None:
        if not settings.mongodb_uri:
            raise RuntimeError("MONGODB_URI is required when APP_STORAGE_PROVIDER=mongo.")
        try:
            from pymongo import MongoClient
        except ImportError as exc:
            raise RuntimeError("Install pymongo to use MongoDB storage.") from exc
        self.client = MongoClient(settings.mongodb_uri)
        self.db = self.client[settings.mongodb_database]
        self.db.users.create_index("email", unique=True)

    def create_user(self, payload: Any) -> dict[str, Any]:
        email = clean_email(payload.email)
        if self.db.users.find_one({"email": email}):
            raise ValueError("An account with this email already exists.")
        password_hash, salt = hash_password(payload.password)
        user = {
            "id": make_id("user"),
            "name": payload.name.strip(),
            "email": email,
            **profile_from_signup(payload),
            "createdAt": utc_now(),
            "passwordHash": password_hash,
            "salt": salt,
        }
        self.db.users.insert_one(user)
        return public_user(user)

    def sign_in(self, email: str, password: str) -> dict[str, Any]:
        record = self.db.users.find_one({"email": clean_email(email)})
        if not record:
            raise ValueError("Email or password did not match an account.")
        password_hash, _salt = hash_password(password, record["salt"])
        if password_hash != record["passwordHash"]:
            raise ValueError("Email or password did not match an account.")
        return public_user(record)

    def find_user_by_email(self, email: str) -> dict[str, Any] | None:
        record = self.db.users.find_one({"email": clean_email(email)})
        return public_user(record) if record else None

    def save_trade_check(self, user_id: str | None, request: dict[str, Any], response: dict[str, Any]) -> None:
        self.db.trade_checks.insert_one(
            {"id": response["id"], "userId": user_id, "request": request, "response": response, "createdAt": utc_now()}
        )

    def save_journal_entry(self, user_id: str, trade_check_id: str | None, entry: dict[str, Any]) -> dict[str, Any]:
        item = {"id": make_id("journal"), "userId": user_id, "tradeCheckId": trade_check_id, **entry, "createdAt": utc_now()}
        self.db.journal_entries.insert_one(item)
        return item

    def list_journal_entries(self, user_id: str) -> list[dict[str, Any]]:
        rows = self.db.journal_entries.find({"userId": user_id}).sort("createdAt", -1)
        return [public_document(row) for row in rows]

    def append_chat(self, user_id: str, thread_id: str | None, user_message: str, assistant_message: str) -> str:
        next_thread_id = thread_id or make_id("thread")
        self.db.chat_threads.update_one(
            {"id": next_thread_id},
            {"$setOnInsert": {"id": next_thread_id, "userId": user_id, "title": user_message[:48], "createdAt": utc_now()}},
            upsert=True,
        )
        self.db.chat_messages.insert_many(
            [
                {"id": make_id("msg"), "threadId": next_thread_id, "userId": user_id, "role": "user", "content": user_message, "createdAt": utc_now()},
                {
                    "id": make_id("msg"),
                    "threadId": next_thread_id,
                    "userId": user_id,
                    "role": "assistant",
                    "content": assistant_message,
                    "createdAt": utc_now(),
                },
            ]
        )
        return next_thread_id


def public_user(record: dict[str, Any]) -> dict[str, Any]:
    private_keys = {"passwordHash", "salt"}
    return {key: value for key, value in record.items() if key not in private_keys and key != "_id"}


def public_document(record: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in record.items() if key != "_id"}


store = MongoStore() if settings.storage_provider == "mongo" else DemoStore()
