import React, { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { arena, lessons, starterJournal, tradeDraft } from "./data/mockData";
import { ArenaScreen } from "./screens/ArenaScreen";
import { CheckScreen } from "./screens/CheckScreen";
import { GrowthScreen } from "./screens/GrowthScreen";
import { JournalScreen } from "./screens/JournalScreen";
import { LearnScreen } from "./screens/LearnScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { generateTradeCheck, saveJournalEntry, summarizeGrowth } from "./services/apiClient";

export default function App() {
  const [activeTab, setActiveTab] = useState("Check");
  const [draft, setDraft] = useState(tradeDraft);
  const [currentReport, setCurrentReport] = useState(null);
  const [journalEntries, setJournalEntries] = useState(starterJournal);
  const [savedReportIds, setSavedReportIds] = useState([]);
  const [savedNotice, setSavedNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const growthStats = useMemo(() => summarizeGrowth(journalEntries), [journalEntries]);
  const reportSaved = currentReport ? savedReportIds.includes(currentReport.id) : false;

  async function handleTradeCheck() {
    setLoading(true);
    setError("");
    setSavedNotice("");
    try {
      const nextReport = await generateTradeCheck(draft);
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
    const entry = await saveJournalEntry(currentReport);
    setJournalEntries((entries) => [entry, ...entries]);
    setSavedReportIds((ids) => [...ids, currentReport.id]);
    setSavedNotice("Saved to Journal");
    setActiveTab("Journal");
  }

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "Check" && (
        <CheckScreen draft={draft} setDraft={setDraft} onCheck={handleTradeCheck} loading={loading} error={error} />
      )}
      {activeTab === "Report" && <ReportScreen report={currentReport} onSave={handleSaveReport} saved={reportSaved} />}
      {activeTab === "Journal" && (
        <JournalScreen entries={journalEntries} savedNotice={savedNotice} onNewCheck={() => setActiveTab("Check")} />
      )}
      {activeTab === "Growth" && <GrowthScreen stats={growthStats} />}
      {activeTab === "Arena" && <ArenaScreen arena={arena} />}
      {activeTab === "Learn" && <LearnScreen lessons={lessons} />}
      {activeTab === "Profile" && <ProfileScreen />}
    </AppShell>
  );
}

