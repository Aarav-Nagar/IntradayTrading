export const tradeDraft = {
  user: "Alex",
  accountSize: 25000,
  riskBudget: 1250,
  ticker: "AAPL",
  tradeType: "Call Option (Long)",
  strike: "190",
  expiration: "Jun 21, 2024",
  amountAtRisk: "500",
  timeframe: "1-2 Weeks"
};

export const baseReport = {
  badge: "Strong Setup",
  setupScore: 72,
  riskScore: 4.2,
  agentAgreement: 78,
  checks: [
    ["Trend Alignment", "good"],
    ["Volatility Context", "good"],
    ["Technical Setup", "good"],
    ["Risk / Reward", "warn"]
  ],
  agents: [
    ["Risk-Managed", 85, "good"],
    ["Neutral", 70, "good"],
    ["Aggressive", 60, "risk"]
  ],
  scenarios: [
    ["Bear Case", "-52%", "-$260", "risk"],
    ["Base Case", "+18%", "+$90", "good"],
    ["Bull Case", "+85%", "+$425", "good"]
  ],
  insight:
    "Setup quality is strong, but position size is slightly above optimal for the selected risk budget."
};

export const starterJournal = [
  {
    id: "sample-aapl",
    ticker: "AAPL",
    title: "AAPL Call (Long)",
    meta: "$190 - Jun 21, 2024",
    status: "Taken",
    entry: "May 24, 2024",
    exit: "May 28, 2024",
    pl: "+$186",
    pct: "+37.2%",
    tags: ["Patient", "Confident"],
    note: "Followed plan. Good entry after pullback."
  },
  {
    id: "sample-nvda",
    ticker: "NVDA",
    title: "NVDA Put (Long)",
    meta: "$110 - May 31, 2024",
    status: "Stopped",
    entry: "May 18, 2024",
    exit: "May 20, 2024",
    pl: "-$142",
    pct: "-28.4%",
    tags: ["Rushed", "FOMO"],
    note: "Entered too quickly. Chopped sideways."
  },
  {
    id: "sample-tsla",
    ticker: "TSLA",
    title: "TSLA Call (Long)",
    meta: "$190 - May 24, 2024",
    status: "Taken",
    entry: "May 10, 2024",
    exit: "May 16, 2024",
    pl: "+$264",
    pct: "+52.8%",
    tags: ["Patient", "Confident"],
    note: "Waited for confirmation and reduced size."
  }
];

export const mockGrowthStats = {
  value: "$25,842",
  return: "+10.1%",
  winRate: "62%",
  avgWin: "+$186",
  avgLoss: "-$142",
  profitFactor: "1.48",
  maxDrawdown: "-8.7%",
  disciplineScore: 81,
  curve: [22, 23, 22.8, 24, 23.6, 25, 26.5, 27.2, 24.6, 25.4, 24.8, 26.1, 25.6, 26.8, 27.6]
};

export const arena = {
  agents: [
    ["Raw Options Agent", "+364%", "#EF4444"],
    ["Risk-Managed Agent", "+153%", "#16A34A"],
    ["Committee Veto", "+68%", "#0EA5E9"],
    ["Buy & Hold (SPY)", "+24%", "#2563EB"]
  ],
  rawPath: [0, 12, 36, 70, 120, 180, 230, 300, 364, 240, 90, -40, -84],
  managedPath: [0, 8, 22, 40, 66, 82, 101, 118, 139, 153, 149, 151, 153]
};

export const lessons = [
  ["What is Implied Volatility?", "Learn how IV affects option prices and why it matters.", "3 min read"],
  ["Break-Even Explained", "Understand how break-even works for calls and puts.", "2 min read"],
  ["Position Sizing Matters", "Why risking too much is the fastest way to blow up.", "2 min read"],
  ["Drawdowns: Part of the Game", "How to survive drawdowns and come back stronger.", "3 min read"],
  ["The 3x Agent Collapse", "Why a fast win can disappear without risk rules.", "4 min read"]
];

