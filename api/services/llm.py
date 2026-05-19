from __future__ import annotations

from typing import Any

from api.settings import settings


SAFETY_LINE = "I can help you reason through risk, but I cannot tell you what to buy or sell."


async def answer_chat(message: str, current_report: dict[str, Any] | None = None) -> tuple[str, list[str]]:
    if not settings.openai_api_key:
        return demo_answer(message, current_report)
    return demo_answer(message, current_report)


def demo_answer(message: str, current_report: dict[str, Any] | None = None) -> tuple[str, list[str]]:
    lower = message.lower()
    if current_report:
        weakest = current_report.get("weakest_link", "the weakest risk area")
        risk = current_report.get("risk_posture", "mixed")
        answer = (
            f"Looking at the current check, the key issue is {weakest}. "
            f"The risk posture is {risk}. A useful next step is to compare the planned max loss with your profile risk limit, "
            f"then write the condition that would invalidate the trade. {SAFETY_LINE}"
        )
    elif "theta" in lower or "iv" in lower or "implied" in lower:
        answer = (
            "For options, the direction can be right and the trade can still lose if implied volatility falls or theta decay eats the premium. "
            "A clean check should separate the stock thesis from the contract structure. "
            f"{SAFETY_LINE}"
        )
    elif "risk" in lower or "size" in lower:
        answer = (
            "Start with max loss, not upside. Compare the dollars at risk to your account size and your default risk budget. "
            "If the idea only works when oversized, the setup is probably not disciplined enough yet. "
            f"{SAFETY_LINE}"
        )
    else:
        answer = (
            "I would frame this as a decision question: what is the thesis, what invalidates it, what is the maximum loss, "
            "and what part of the setup is weakest? "
            f"{SAFETY_LINE}"
        )

    prompts = [
        "Explain the weakest link in my latest check",
        "What questions should I answer before entering?",
        "Explain why options can lose even when direction is right",
    ]
    return answer, prompts
