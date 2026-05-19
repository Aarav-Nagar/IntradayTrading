import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppShell } from "./components/AppShell";
import { Card } from "./components/Card";
import { PrimaryButton, sharedText } from "./components/Shared";
import { arena, lessons, starterJournal, tradeDraft } from "./data/mockData";
import { AuthScreen } from "./screens/AuthScreen";
import { ArenaScreen } from "./screens/ArenaScreen";
import { CheckScreen } from "./screens/CheckScreen";
import { GrowthScreen } from "./screens/GrowthScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { JournalScreen } from "./screens/JournalScreen";
import { LearnScreen } from "./screens/LearnScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { AlertsScreen } from "./screens/AlertsScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { createAccount, requestPasswordReset, restoreSession, signIn, signOut } from "./services/authService";
import { generateTradeCheck, listJournalEntries, saveJournalEntry, summarizeGrowth } from "./services/apiClient";
import { palette } from "./theme/theme";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [draft, setDraft] = useState(tradeDraft);
  const [currentReport, setCurrentReport] = useState(null);
  const [journalEntries, setJournalEntries] = useState(starterJournal);
  const [savedReportIds, setSavedReportIds] = useState([]);
  const [savedNotice, setSavedNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const growthStats = useMemo(() => summarizeGrowth(journalEntries), [journalEntries]);
  const reportSaved = currentReport ? savedReportIds.includes(currentReport.id) : false;

  useEffect(() => {
    let mounted = true;
    async function restoreState() {
      try {
        const session = await restoreSession();
        if (!mounted) {
          return;
        }
        if (session) {
          setCurrentUser(session);
          setDraft((current) => ({
            ...current,
            user: firstName(session.name),
            accountSize: session.accountSize || 25000,
            riskBudget: Math.round((Number(session.accountSize || 25000) * Number(session.riskBudgetPercent || 2)) / 100)
          }));
        }
      } catch (err) {
        setShowOnboarding(true);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }
    restoreState();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function restoreJournal() {
      if (!currentUser) {
        return;
      }
      try {
        const entries = await listJournalEntries(currentUser);
        if (mounted) {
          setJournalEntries(entries.length ? entries : starterJournal);
        }
      } catch (err) {
        if (mounted) {
          setJournalEntries(starterJournal);
        }
      }
    }
    restoreJournal();
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  async function handleTradeCheck() {
    setLoading(true);
    setError("");
    setSavedNotice("");
    try {
      const nextReport = await generateTradeCheck(draft, currentUser);
      setCurrentReport(nextReport);
      setActiveTab("Report");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveReport() {
    if (!currentReport) {
      return;
    }
    if (savedReportIds.includes(currentReport.id)) {
      setSavedNotice("Already saved to Journal");
      setActiveTab("Journal");
      return;
    }
    const entry = await saveJournalEntry(currentReport, currentUser);
    setJournalEntries((entries) => [entry, ...entries]);
    setSavedReportIds((ids) => [...ids, currentReport.id]);
    setSavedNotice("Saved to Journal");
    setActiveTab("Journal");
  }

  async function dismissOnboarding() {
    setShowOnboarding(false);
  }

  async function handleCreateAccount(form) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const user = await createAccount(form);
      enterApp(user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignIn(form) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const user = await signIn(form);
      enterApp(user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    setCurrentUser(null);
    setCurrentReport(null);
    setSavedReportIds([]);
    setSavedNotice("");
    setActiveTab("Home");
    setJournalEntries(starterJournal);
  }

  async function handlePasswordReset(form) {
    setAuthLoading(true);
    setAuthError("");
    try {
      return await requestPasswordReset(form);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }

function enterApp(user) {
  setCurrentUser(user);
  setDraft((current) => ({
    ...current,
    user: firstName(user.name),
    accountSize: user.accountSize || 25000,
    riskBudget: Math.round((Number(user.accountSize || 25000) * Number(user.riskBudgetPercent || 2)) / 100)
  }));
  setActiveTab("Home");
}

  if (!ready) {
    return (
      <AppShell showTabs={false}>
        <View style={styles.loadingScreen}>
          <Text style={sharedText.sectionTitle}>Loading Options Risk Check...</Text>
        </View>
      </AppShell>
    );
  }

  if (!currentUser) {
    return (
      <AppShell showTabs={false}>
        <AuthScreen
          onCreateAccount={handleCreateAccount}
          onSignIn={handleSignIn}
          onRequestPasswordReset={handlePasswordReset}
          loading={authLoading}
          error={authError}
        />
      </AppShell>
    );
  }

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {showOnboarding ? <OnboardingNotice onDismiss={dismissOnboarding} /> : null}
      {activeTab === "Home" && (
        <HomeScreen
          user={currentUser}
          draft={draft}
          entries={journalEntries}
          stats={growthStats}
          report={currentReport}
          navigate={setActiveTab}
        />
      )}
      {activeTab === "Search" && <SearchScreen user={currentUser} draft={draft} setDraft={setDraft} navigate={setActiveTab} />}
      {activeTab === "Check" && (
        <CheckScreen draft={draft} setDraft={setDraft} onCheck={handleTradeCheck} loading={loading} error={error} />
      )}
      {activeTab === "Alerts" && <AlertsScreen user={currentUser} stats={growthStats} navigate={setActiveTab} />}
      {activeTab === "Chat" && <ChatScreen user={currentUser} currentReport={currentReport} />}
      {activeTab === "Report" && (
        <ReportScreen report={currentReport} onSave={handleSaveReport} saved={reportSaved} onAskAi={() => setActiveTab("Chat")} />
      )}
      {activeTab === "Journal" && (
        <JournalScreen entries={journalEntries} savedNotice={savedNotice} onNewCheck={() => setActiveTab("Check")} />
      )}
      {activeTab === "Growth" && <GrowthScreen stats={growthStats} />}
      {activeTab === "Arena" && <ArenaScreen arena={arena} />}
      {activeTab === "Learn" && <LearnScreen lessons={lessons} />}
      {activeTab === "Profile" && <ProfileScreen user={currentUser} onSignOut={handleSignOut} />}
    </AppShell>
  );
}

function firstName(name) {
  return (name || "Alex").split(" ")[0];
}

function OnboardingNotice({ onDismiss }) {
  return (
    <View style={styles.onboardingOverlay}>
      <Card style={styles.onboardingCard}>
        <Text style={sharedText.sectionTitle}>Educational risk checks only</Text>
        <Text style={sharedText.bodyText}>
          This demo helps structure options risk, journal decisions, and study agent experiments. It does not execute trades,
          give financial advice, or tell you what to buy or sell.
        </Text>
        <PrimaryButton label="I Understand" onPress={onDismiss} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingOverlay: {
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 74,
    backgroundColor: "rgba(247,249,247,0.92)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  onboardingCard: {
    borderColor: "#BCEAC9",
    backgroundColor: "#FBFFFC"
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  }
});
