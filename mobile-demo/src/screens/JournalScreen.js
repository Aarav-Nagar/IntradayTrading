import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { Metric } from "../components/Metric";
import { Pill } from "../components/Pill";
import { ChipRow, Header, PrimaryButton, ScreenScroll, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function JournalScreen({ entries, savedNotice, onNewCheck }) {
  return (
    <ScreenScroll>
      <Header kicker="3. JOURNAL" title="Journal" subtitle="Track your checks and learn from outcomes." />
      {savedNotice ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{savedNotice}</Text>
        </View>
      ) : null}
      <ChipRow items={["All", "Taken", "Open Checks", "Closed", "Filter"]} active="All" />
      {entries.map((entry) => (
        <TradeCard entry={entry} key={entry.id} />
      ))}
      <PrimaryButton label="+ New Check" onPress={onNewCheck} />
    </ScreenScroll>
  );
}

function TradeCard({ entry }) {
  const positive = entry.pl.startsWith("+");
  const riskTag = (tag) => tag === "FOMO" || tag === "Rushed";
  return (
    <Card>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Logo ticker={entry.ticker} />
          <View>
            <Text style={sharedText.mediumTitle}>{entry.title}</Text>
            <Text style={sharedText.bodyText}>{entry.meta}</Text>
          </View>
        </View>
        <Pill label={entry.status} tone={positive ? "good" : entry.status === "Stopped" ? "risk" : "good"} />
      </View>
      <View style={styles.tradeStats}>
        <Metric label="Entry" value={entry.entry} />
        <Metric label="Exit" value={entry.exit} />
        <Metric label="P/L" value={entry.pl} />
      </View>
      <View style={styles.tagRow}>
        {entry.tags.map((tag) => (
          <Pill key={tag} label={tag} tone={riskTag(tag) ? "risk" : "good"} />
        ))}
      </View>
      <Text style={sharedText.bodyText}>Notes: {entry.note}</Text>
    </Card>
  );
}

function Logo({ ticker }) {
  const color = ticker === "NVDA" ? palette.green : ticker === "TSLA" ? palette.red : palette.dark;
  return (
    <View style={[styles.logo, { borderColor: color }]}>
      <Text style={[styles.logoText, { color }]}>{ticker.slice(0, 1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    padding: 11,
    backgroundColor: palette.greenSoft,
    borderRadius: 14,
    marginBottom: 10
  },
  noticeText: {
    color: palette.green,
    fontWeight: "900"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  logoText: {
    fontWeight: "900",
    fontSize: 15
  },
  tradeStats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  tagRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 10,
    marginBottom: 8
  }
});

