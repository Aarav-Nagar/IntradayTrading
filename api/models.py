from typing import Any

from pydantic import BaseModel, Field


class ProfilePayload(BaseModel):
    accountSize: float = Field(gt=0, default=25000)
    riskBudgetPercent: float = Field(gt=0, le=25, default=2)
    purpose: list[str] = []
    tradeFocus: list[str] = []
    experienceLevel: str = "Some experience"
    riskStyle: str = "Balanced"
    struggles: list[str] = []
    reminders: list[str] = []
    sectors: list[str] = []
    marketCaps: list[str] = []
    events: list[str] = []
    safetyAccepted: bool = False


class SignupRequest(ProfilePayload):
    name: str = Field(min_length=1, max_length=80)
    email: str = Field(min_length=3, max_length=160)
    password: str = Field(min_length=6, max_length=200)


class SigninRequest(BaseModel):
    email: str = Field(min_length=3, max_length=160)
    password: str = Field(min_length=6, max_length=200)


class ForgotPasswordRequest(BaseModel):
    email: str = Field(min_length=3, max_length=160)


class UserResponse(ProfilePayload):
    id: str
    name: str
    email: str


class ForgotPasswordResponse(BaseModel):
    email: str
    knownAccount: bool
    message: str


class TradeCheckRequest(BaseModel):
    user_id: str | None = None
    ticker: str = Field(min_length=1, max_length=12)
    trade_type: str
    strike: float = Field(ge=0)
    expiration: str
    amount_at_risk: float = Field(gt=0)
    timeframe: str
    account_size: float = Field(gt=0)


class TradeCheckResponse(BaseModel):
    id: str
    ticker: str
    trade_type: str
    title: str
    subtitle: str
    badge: str
    setup_score: int
    risk_score: float
    agent_agreement: int
    methodology_label: str
    insight: str
    strike: float
    expiration: str
    amount_at_risk: float
    timeframe: str
    checks: list[list[str]]
    agents: list[list[object]]
    scenarios: list[list[str]]
    overall_read: str
    weakest_link: str
    risk_posture: str
    decision_snapshot: dict[str, Any]
    risk_math: dict[str, Any]
    agent_docket: list[dict[str, Any]]
    agreement_map: dict[str, Any]
    questions: list[str]


class JournalEntryRequest(BaseModel):
    user_id: str
    trade_check_id: str | None = None
    entry: dict[str, Any]


class JournalEntryResponse(BaseModel):
    id: str
    entry: dict[str, Any]


class ChatRequest(BaseModel):
    user_id: str
    thread_id: str | None = None
    message: str = Field(min_length=1, max_length=1200)
    current_report: dict[str, Any] | None = None


class ChatResponse(BaseModel):
    thread_id: str
    answer: str
    suggested_prompts: list[str]
