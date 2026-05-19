from __future__ import annotations

from datetime import datetime, timezone

from .models import TradeCheckRequest, TradeCheckResponse


def score_trade_check(request: TradeCheckRequest) -> TradeCheckResponse:
    ticker = request.ticker.upper().strip()
    risk_percent = request.amount_at_risk / request.account_size * 100
    option_risk = 1.0 if "Option" in request.trade_type else 0.4
    timeframe_adjustment = {
        "Intraday": 0.9,
        "1-3 Days": 0.7,
        "1-2 Weeks": 0.45,
        "1 Month+": 0.35,
    }.get(request.timeframe, 0.55)

    risk_score = min(9.2, round(2.4 + risk_percent * 0.75 + option_risk + timeframe_adjustment, 1))
    setup_score = max(48, min(84, round(76 - max(0, risk_percent - 1.5) * 5 - timeframe_adjustment * 3)))
    options_structure = max(35, min(88, round(82 - risk_score * 5.2 - timeframe_adjustment * 7)))
    behavior_score = max(38, min(84, round(76 - max(0, risk_percent - 1.0) * 7)))
    market_context = max(45, min(78, round(64 + (setup_score - 65) * 0.2)))
    agent_agreement = max(52, min(88, round(setup_score + 8 - risk_score * 2.2)))
    profile_limit = 2.0
    amount_above_profile = max(0.0, request.amount_at_risk - request.account_size * profile_limit / 100)
    required_move = round(2.5 + risk_score * 0.42 + timeframe_adjustment * 1.8, 1)
    trading_days = {"Intraday": 1, "1-3 Days": 3, "1-2 Weeks": 9, "1 Month+": 22}.get(request.timeframe, 9)

    if risk_percent > 3:
        badge = "High Risk"
        risk_posture = "Elevated"
        weakest_link = "Position sizing"
        overall_read = "Reviewable only after reducing size"
        insight = (
            "The planned risk is large relative to the demo account. This review suggests reducing size or waiting for a "
            "cleaner setup before making any real-world decision."
        )
    elif setup_score >= 70 and risk_score <= 5.5:
        badge = "Constructive Setup"
        risk_posture = "Controlled"
        weakest_link = "Contract timing" if option_risk else "Entry timing"
        overall_read = "Constructive, but still needs an exit plan"
        insight = (
            "The check has constructive technical context and controlled sizing. Treat this as a structured risk review, "
            "not a directional prediction."
        )
    else:
        badge = "Needs Review"
        risk_posture = "Mixed"
        weakest_link = "Signal clarity"
        overall_read = "Mixed evidence; clarify the thesis before acting"
        insight = (
            "The setup has mixed evidence. The app would flag this for more review rather than treating it as a high-quality setup."
        )

    return TradeCheckResponse(
        id=f"api-{int(datetime.now(timezone.utc).timestamp())}",
        ticker=ticker,
        trade_type=request.trade_type,
        title=f"{ticker} {request.trade_type}",
        subtitle=f"${request.strike:g} Strike - {request.expiration} - {request.timeframe}",
        badge=badge,
        setup_score=setup_score,
        risk_score=risk_score,
        agent_agreement=agent_agreement,
        methodology_label="Backend educational score",
        insight=insight,
        strike=request.strike,
        expiration=request.expiration,
        amount_at_risk=request.amount_at_risk,
        timeframe=request.timeframe,
        checks=[
            ["Trend Context", "good" if setup_score >= 65 else "warn"],
            ["Volatility Context", "good" if risk_score <= 6 else "warn"],
            ["Sizing Discipline", "good" if risk_percent <= 2 else "warn"],
            ["Risk Review", "warn" if risk_percent > 2 else "good"],
        ],
        agents=[
            ["Risk-Managed", min(92, agent_agreement + 10), "good"],
            ["Neutral", agent_agreement, "good"],
            ["Aggressive", max(45, agent_agreement - 18), "risk"],
        ],
        scenarios=[
            ["Bear Case", "-50%", f"-${request.amount_at_risk * 0.5:.0f}", "risk"],
            ["Base Case", "+15%", f"+${request.amount_at_risk * 0.15:.0f}", "good"],
            ["Bull Case", "+75%", f"+${request.amount_at_risk * 0.75:.0f}", "good"],
        ],
        overall_read=overall_read,
        weakest_link=weakest_link,
        risk_posture=risk_posture,
        decision_snapshot={
            "setup_quality": setup_score,
            "options_structure": options_structure,
            "risk_budget_used": round(risk_percent, 2),
            "profile_risk_limit": profile_limit,
            "agent_disagreement": "High" if agent_agreement < 62 else "Medium" if agent_agreement < 78 else "Low",
            "review_status": badge,
        },
        risk_math={
            "capital_at_risk": round(request.amount_at_risk, 2),
            "max_loss": round(request.amount_at_risk, 2),
            "half_premium_drawdown": -round(request.amount_at_risk * 0.5, 2),
            "amount_above_profile": round(amount_above_profile, 2),
            "required_move_to_breakeven_pct": required_move,
            "trading_days_left": trading_days,
        },
        agent_docket=[
            {
                "name": "Setup Agent",
                "score": setup_score,
                "read": "Constructive" if setup_score >= 70 else "Incomplete",
                "evidence": "Trend and momentum context are acceptable, but the entry still needs a defined invalidation level.",
            },
            {
                "name": "Options Risk Agent",
                "score": options_structure,
                "read": "Fragile" if options_structure < 60 else "Usable",
                "evidence": f"The contract has about {trading_days} trading day(s) and needs roughly a {required_move}% move to clear the modeled breakeven zone.",
            },
            {
                "name": "Behavior Agent",
                "score": behavior_score,
                "read": "Personal warning" if risk_percent > profile_limit else "Aligned",
                "evidence": f"The planned risk uses {risk_percent:.1f}% of the account versus a {profile_limit:.1f}% profile limit.",
            },
            {
                "name": "Market Context Agent",
                "score": market_context,
                "read": "Mixed",
                "evidence": "Broad market context is treated as neutral until live sector and index data are connected.",
            },
            {
                "name": "Risk Manager",
                "score": max(35, min(90, round((setup_score + options_structure + behavior_score + market_context) / 4))),
                "read": "Reduce size" if risk_percent > profile_limit else "Plan first",
                "evidence": "The risk manager prioritizes max loss, sizing discipline, and whether the trade has a written invalidation point.",
            },
        ],
        agreement_map={
            "agree": [
                "The idea is worth reviewing as a structured risk check.",
                "The maximum loss must be acceptable before any real decision.",
            ],
            "disagree": [
                "Technical setup quality is stronger than the option/risk structure.",
                "Sizing may be the limiting factor even if the direction thesis is reasonable.",
            ],
            "main_conflict": f"{weakest_link} is the current weakest link.",
        },
        questions=[
            "What exact price or condition invalidates this trade?",
            "Would the trade still make sense at half the size?",
            "Are you comfortable with the full premium going to zero?",
            "Is this a planned setup or a reaction to recent movement?",
        ],
    )
