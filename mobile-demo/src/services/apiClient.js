import { baseReport, mockGrowthStats } from "../data/mockData";

export async function generateTradeCheck(draft) {
  await delay(350);

  const amount = Number(draft.amountAtRisk || 0);
  if (!draft.ticker || amount <= 0) {
    throw new Error("Missing ticker or risk amount.");
  }

  const riskPercent = (amount / Number(draft.accountSize || 1)) * 100;
  const riskPenalty = riskPercent > 2 ? Math.min(12, Math.round((riskPercent - 2) * 4)) : 0;
  const setupScore = Math.max(50, baseReport.setupScore - riskPenalty);
  const riskScore = Math.min(8.5, Number((3.2 + riskPercent / 2).toFixed(1)));

  return {
    id: `check-${Date.now()}`,
    ...baseReport,
    title: `${draft.ticker.toUpperCase()} ${draft.tradeType}`,
    subtitle: `$${draft.strike} Strike - ${draft.expiration} - ${draft.timeframe}`,
    ticker: draft.ticker.toUpperCase(),
    tradeType: draft.tradeType,
    strike: draft.strike,
    expiration: draft.expiration,
    amountAtRisk: amount,
    timeframe: draft.timeframe,
    setupScore,
    riskScore,
    agentAgreement: Math.max(55, baseReport.agentAgreement - Math.round(riskPenalty * 1.5)),
    insight:
      riskPercent > 2
        ? "The setup is interesting, but the planned risk is above the app's conservative demo limit. Consider reviewing size before acting."
        : baseReport.insight
  };
}

export async function saveJournalEntry(report) {
  await delay(150);
  return {
    id: `journal-${Date.now()}`,
    ticker: report.ticker,
    title: `${report.ticker} ${report.tradeType.replace(" Option", "")}`,
    meta: `$${report.strike} - ${report.expiration}`,
    status: "Open Check",
    entry: "Today",
    exit: "Open",
    pl: "$0",
    pct: "0.0%",
    tags: ["Planned", report.setupScore >= 70 ? "Confident" : "Watchlist"],
    note: "Saved from risk check. Outcome not entered yet."
  };
}

export function summarizeGrowth(entries) {
  const completed = entries.filter((entry) => entry.pl.startsWith("+") || entry.pl.startsWith("-"));
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
    disciplineScore: Math.min(94, 70 + entries.filter((entry) => entry.tags.includes("Patient")).length * 3),
    curve: mockGrowthStats.curve.map((point, index) => point + (total / 400) * (index / mockGrowthStats.curve.length))
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

