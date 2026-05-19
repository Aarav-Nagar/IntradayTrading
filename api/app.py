import sentry_sdk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    ChatRequest,
    ChatResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    JournalEntryRequest,
    JournalEntryResponse,
    SigninRequest,
    SignupRequest,
    TradeCheckRequest,
    TradeCheckResponse,
    UserResponse,
)
from .scoring import score_trade_check
from .services.llm import answer_chat
from .services.store import clean_email, store
from .settings import settings

if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, environment=settings.environment, traces_sample_rate=0.05)

app = FastAPI(title="Options Risk Check API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8091", "http://localhost:8091", "http://localhost:8081", "http://127.0.0.1:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "storage": settings.storage_provider}


@app.post("/auth/signup", response_model=UserResponse)
def signup(request: SignupRequest) -> UserResponse:
    try:
        return UserResponse(**store.create_user(request))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/auth/signin", response_model=UserResponse)
def signin(request: SigninRequest) -> UserResponse:
    try:
        return UserResponse(**store.sign_in(request.email, request.password))
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


@app.post("/auth/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(request: ForgotPasswordRequest) -> ForgotPasswordResponse:
    email = clean_email(request.email)
    known = store.find_user_by_email(email) is not None
    return ForgotPasswordResponse(
        email=mask_email(email),
        knownAccount=known,
        message="If connected to Clerk, a secure reset email would be sent. Demo mode records no password-reset email.",
    )


@app.post("/trade-check", response_model=TradeCheckResponse)
def trade_check(request: TradeCheckRequest) -> TradeCheckResponse:
    response = score_trade_check(request)
    store.save_trade_check(request.user_id, request.model_dump(), response.model_dump())
    return response


@app.get("/journal/{user_id}")
def list_journal(user_id: str) -> list[dict]:
    return store.list_journal_entries(user_id)


@app.post("/journal", response_model=JournalEntryResponse)
def create_journal_entry(request: JournalEntryRequest) -> JournalEntryResponse:
    entry = store.save_journal_entry(request.user_id, request.trade_check_id, request.entry)
    return JournalEntryResponse(id=entry["id"], entry=entry)


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    answer, prompts = await answer_chat(request.message, request.current_report)
    thread_id = store.append_chat(request.user_id, request.thread_id, request.message, answer)
    return ChatResponse(thread_id=thread_id, answer=answer, suggested_prompts=prompts)


def mask_email(email: str) -> str:
    name, _, domain = email.partition("@")
    return f"{name[:2]}{'*' * max(2, len(name) - 2)}@{domain}" if domain else email
