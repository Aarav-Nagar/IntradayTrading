import { baseReport, mockGrowthStats } from "../data/mockData";
import { API_BASE_URL } from "./config";

export async function generateTradeCheck(draft, user) {
  const data = await postJson("/trade-check", {
    user_id: user?.id,
    ticker: draft.ticker,
    trade_type: draft.tradeType,
    strike: Number(draft.strike || 0),
    expiration: draft.expiration,
    amount_at_risk: Number(draft.amountAtRisk || 0),
    timeframe: draft.timeframe,
    account_size: Number(draft.accountSize || 0)
  });
  return normalizeBackendReport(data, draft);
}

export async function saveJournalEntry(report, user) {
  const entry = {
    ticker: report.ticker,
    title: `${report.ticker} ${report.tradeType.replace(" Option", "")}`,
    meta: `$${report.strike} - ${report.expiration}`,
    status: "Open Check",
    entry: "Today",
    exit: "Open",
    pl: "$0",
    pct: "0.0%",
    tags: ["Planned", report.setupScore >= 70 ? "Confident" : "Watchlist"],
    note: `Saved from risk brief. Weakest link: ${report.weakestLink || "not set"}.`
  };
  const data = await postJson("/journal", { user_id: user.id, trade_check_id: report.id, entry });
  return data.entry;
}

export async function listJournalEntries(user) {
  const response = await fetch(`${API_BASE_URL}/journal/${user.id}`);
  if (!response.ok) {
    throw new Error("Could not load journal entries.");
  }
  return response.json();
}

export async function sendChatMessage({ user, threadId, message, currentReport }) {
  return postJson("/chat", {
    user_id: user.id,
    thread_id: threadId,
    message,
    current_report: currentReport
  });
}

function normalizeBackendReport(data, draft) {
  return {
    id: data.id || `check-${Date.now()}`,
    ...baseReport,
    title: data.title || `${draft.ticker.toUpperCase()} ${draft.tradeType}`,
    subtitle: data.subtitle || `$${draft.strike} Strike - ${draft.expiration} - ${draft.timeframe}`,
    ticker: data.ticker || draft.ticker.toUpperCase(),
    tradeType: data.trade_type || draft.tradeType,
    strike: String(data.strike || draft.strike),
    expiration: data.expiration || draft.expiration,
    amountAtRisk: data.amount_at_risk || Number(draft.amountAtRisk || 0),
    timeframe: data.timeframe || draft.timeframe,
    badge: data.badge || baseReport.badge,
    setupScore: data.setup_score ?? baseReport.setupScore,
    riskScore: data.risk_score ?? baseReport.riskScore,
    agentAgreement: data.agent_agreement ?? baseReport.agentAgreement,
    checks: data.checks || baseReport.checks,
    agents: data.agents || baseReport.agents,
    scenarios: data.scenarios || baseReport.scenarios,
    methodologyLabel: data.methodology_label || "Backend educational score",
    insight: data.insight || baseReport.insight,
    overallRead: data.overall_read || "Review the trade structure before deciding",
    weakestLink: data.weakest_link || "Position sizing",
    riskPosture: data.risk_posture || "Mixed",
    decisionSnapshot: data.decision_snapshot || {},
    riskMath: data.risk_math || {},
    agentDocket: data.agent_docket || [],
    agreementMap: data.agreement_map || {},
    questions: data.questions || []
  };
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "The API service is unavailable.");
  }
  return data;
}

export function summarizeGrowth(entries) {
  const completed = entries.filter((entry) => entry.pl?.startsWith("+") || entry.pl?.startsWith("-"));
  if (completed.length === 0) {
    return mockGrowthStats;
  }

  const values = completed.map((entry) => Number(entry.pl.replace(/[^0-9.-]/g, "")));
  const wins = values.filter((value) => value > 0);
  const losses = values.filter((value) => value < 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  const avgWin = wins.length ? wins.reduce((sum, value) => sum + value, 0) / wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((sum, value) => sum + value, 0) / losses.length : 0;
  const profitFactor =
    losses.length && avgLoss !== 0
      ? Math.abs(wins.reduce((sum, value) => sum + value, 0) / losses.reduce((sum, value) => sum + value, 0))
      : wins.length
        ? 2.0
        : 1.0;

  return {
    value: `$${(25000 + total).toLocaleString()}`,
    return: `${total >= 0 ? "+" : ""}${((total / 25000) * 100).toFixed(1)}%`,
    winRate: `${Math.round((wins.length / completed.length) * 100)}%`,
    avgWin: `${avgWin >= 0 ? "+" : "-"}$${Math.abs(Math.round(avgWin))}`,
    avgLoss: `${avgLoss >= 0 ? "+" : "-"}$${Math.abs(Math.round(avgLoss))}`,
    profitFactor: profitFactor.toFixed(2),
    maxDrawdown: mockGrowthStats.maxDrawdown,
    disciplineScore: Math.min(94, 70 + entries.filter((entry) => entry.tags?.includes("Patient")).length * 3),
    curve: mockGrowthStats.curve.map((point, index) => point + (total / 400) * (index / mockGrowthStats.curve.length))
  };
}
