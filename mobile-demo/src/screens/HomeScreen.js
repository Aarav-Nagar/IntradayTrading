import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/Card";
import { LineChart } from "../components/LineChart";
import { Header, money, ScreenScroll, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function HomeScreen({ user, draft, entries, stats, report, navigate }) {
  const name = (user?.name || draft.user || "Alex").split(" ")[0];
  const latestEntry = entries?.[0];

  return (
    <ScreenScroll>
      <Header title={`Good morning, ${name}`} subtitle="Your risk workspace is ready." />
      <Card style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>Account Snapshot</Text>
            <Text style={styles.accountValue}>{money(draft.accountSize)}</Text>
            <Text style={sharedText.bodyText}>Default risk budget: {money(draft.riskBudget)}</Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scoreValue}>{stats.disciplineScore}</Text>
            <Text style={styles.scoreLabel}>discipline</Text>
          </View>
        </View>
        <LineChart points={stats.curve} fill />
      </Card>

      <View style={styles.quickGrid}>
        <ActionTile icon="shield-checkmark-outline" title="Check Risk" text="Review a trade idea." onPress={() => navigate("Check")} />
        <ActionTile icon="book-outline" title="Journal" text={`${entries.length} saved checks`} onPress={() => navigate("Journal")} />
        <ActionTile icon="trending-up-outline" title="Growth" text={`${stats.return} demo return`} onPress={() => navigate("Growth")} />
        <ActionTile icon="trophy-outline" title="Arena" text="Replay agent results." onPress={() => navigate("Arena")} />
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <Text style={sharedText.sectionTitle}>Today</Text>
          <Pressable onPress={() => navigate("Learn")}>
            <Text style={styles.link}>Learn</Text>
          </Pressable>
        </View>
        <TaskRow icon="analytics-outline" label={report ? "Review the latest report" : "Run one risk check"} onPress={() => navigate(report ? "Report" : "Check")} />
        <TaskRow icon="notifications-outline" label="Set a sizing reminder before entry" onPress={() => navigate("Alerts")} />
        <TaskRow icon="search-outline" label="Explore sectors and event focus" onPress={() => navigate("Search")} />
      </Card>

      {latestEntry ? (
        <Card>
          <Text style={sharedText.sectionTitle}>Latest Journal Note</Text>
          <Text style={styles.tradeTitle}>{latestEntry.title}</Text>
          <Text style={sharedText.bodyText}>{latestEntry.note}</Text>
          <Text style={[styles.pnl, latestEntry.pl?.startsWith("-") && styles.pnlBad]}>{latestEntry.pl} / {latestEntry.pct}</Text>
        </Card>
      ) : null}
    </ScreenScroll>
  );
}

function ActionTile({ icon, title, text, onPress }) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={styles.tileIcon}>
        <Ionicons name={icon} size={20} color={palette.green} />
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileText}>{text}</Text>
    </Pressable>
  );
}

function TaskRow({ icon, label, onPress }) {
  return (
    <Pressable style={styles.taskRow} onPress={onPress}>
      <Ionicons name={icon} size={18} color={palette.green} />
      <Text style={styles.taskLabel}>{label}</Text>
      <Text style={styles.chevron}>&gt;</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#FBFFFC"
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  eyebrow: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 5
  },
  accountValue: {
    color: palette.dark,
    fontSize: 28,
    fontWeight: "900"
  },
  scorePill: {
    width: 82,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CFEFD8",
    backgroundColor: "#F3FFF6",
    padding: 10,
    alignItems: "center"
  },
  scoreValue: {
    color: palette.green,
    fontSize: 24,
    fontWeight: "900"
  },
  scoreLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "800"
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 2
  },
  tile: {
    width: "48.4%",
    minHeight: 122,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#FFFFFF",
    padding: 14,
    justifyContent: "space-between"
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.greenSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  tileTitle: {
    color: palette.dark,
    fontSize: 15,
    fontWeight: "900"
  },
  tileText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  link: {
    color: palette.green,
    fontSize: 12,
    fontWeight: "900"
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: palette.border
  },
  taskLabel: {
    flex: 1,
    color: palette.dark,
    fontSize: 13,
    fontWeight: "800"
  },
  chevron: {
    color: palette.muted,
    fontSize: 18
  },
  tradeTitle: {
    color: palette.dark,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 5
  },
  pnl: {
    color: palette.green,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8
  },
  pnlBad: {
    color: palette.red
  }
});
