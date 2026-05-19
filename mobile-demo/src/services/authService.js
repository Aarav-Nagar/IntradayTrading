import { API_BASE_URL } from "./config";

let memorySession = null;

export async function restoreSession() {
  return memorySession;
}

export async function createAccount(profile) {
  const payload = {
    name: profile.name,
    email: profile.email,
    password: profile.password,
    accountSize: Number(profile.accountSize || 25000),
    riskBudgetPercent: Number(profile.riskBudgetPercent || 2),
    purpose: profile.purpose || [],
    tradeFocus: profile.tradeFocus || [],
    experienceLevel: profile.experienceLevel || "Still learning",
    riskStyle: profile.riskStyle || "Balanced",
    struggles: profile.struggles || [],
    reminders: profile.reminders || [],
    sectors: profile.sectors || [],
    marketCaps: profile.marketCaps || [],
    events: profile.events || [],
    safetyAccepted: Boolean(profile.safetyAccepted)
  };
  const user = await postJson("/auth/signup", payload);
  memorySession = user;
  return user;
}

export async function signIn({ email, password }) {
  const user = await postJson("/auth/signin", { email, password });
  memorySession = user;
  return user;
}

export async function requestPasswordReset({ email }) {
  return postJson("/auth/forgot-password", { email });
}

export async function signOut() {
  memorySession = null;
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "The account service is unavailable.");
  }
  return data;
}
