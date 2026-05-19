import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/Card";
import { Pill } from "../components/Pill";
import { Header, PrimaryButton, ScreenScroll, SecondaryButton, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function ReportScreen({ report, onSave, saved, onAskAi }) {
  if (!report) {
    return (
      <ScreenScroll>
        <Header title="No report yet" subtitle="Run a check first to generate a trade report." />
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <Header title={`${report.ticker} Risk Brief`} subtitle={report.subtitle} right={<Pill label={report.riskPosture} tone="good" />} />
      <View style={styles.methodology}>
        <Text style={styles.methodologyText}>{report.methodologyLabel || "Educational risk review"} - not financial advice</Text>
      </View>

      <Card style={styles.briefCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.overall}>{report.overallRead}</Text>
          <View style={styles.weakPill}>
            <Text style={styles.weakLabel}>Weakest Link</Text>
            <Text style={styles.weakText}>{report.weakestLink}</Text>
          </View>
        </View>
        <Text style={sharedText.bodyText}>{report.insight}</Text>
      </Card>

      <Card>
        <Text style={sharedText.sectionTitle}>Decision Snapshot</Text>
        <View style={styles.snapshotGrid}>
          <ScoreTile label="Setup" value={report.decisionSnapshot.setup_quality ?? report.setupScore} suffix="/100" />
          <ScoreTile label="Options" value={report.decisionSnapshot.options_structure ?? 58} suffix="/100" />
          <ScoreTile label="Risk Used" value={report.decisionSnapshot.risk_budget_used ?? 0} suffix="%" risk={(report.decisionSnapshot.risk_budget_used ?? 0) > 2} />
          <ScoreTile label="Disagree" value={report.decisionSnapshot.agent_disagreement || "Med"} />
        </View>
      </Card>

      <Card>
        <Text style={sharedText.sectionTitle}>Risk Math</Text>
        <View style={styles.mathGrid}>
          <MathItem label="Max loss" value={money(report.riskMath.max_loss)} />
          <MathItem label="50% drawdown" value={money(report.riskMath.half_premium_drawdown)} risk />
          <MathItem label="Above profile" value={money(report.riskMath.amount_above_profile)} risk={Number(report.riskMath.amount_above_profile || 0) > 0} />
          <MathItem label="Breakeven move" value={`${report.riskMath.required_move_to_breakeven_pct ?? "?"}%`} />
          <MathItem label="Days left" value={`${report.riskMath.trading_days_left ?? "?"}`} />
          <MathItem label="Capital at risk" value={money(report.riskMath.capital_at_risk)} />
        </View>
      </Card>

      <Card>
        <Text style={sharedText.sectionTitle}>Agent Docket</Text>
        {report.agentDocket.map((agent) => (
          <AgentRow key={agent.name} agent={agent} />
        ))}
      </Card>

      <Card>
        <Text style={sharedText.sectionTitle}>Agreement Map</Text>
        <Text style={styles.conflict}>{report.agreementMap.main_conflict}</Text>
        <MapList title="Agents agree" items={report.agreementMap.agree || []} good />
        <MapList title="Agents disagree" items={report.agreementMap.disagree || []} />
      </Card>

      <Card>
        <Text style={sharedText.sectionTitle}>Questions Before Acting</Text>
        {report.questions.map((question, index) => (
          <View key={question} style={styles.questionRow}>
            <Text style={styles.questionNumber}>{index + 1}</Text>
            <Text style={styles.questionText}>{question}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.actionRow}>
        <SecondaryButton label={saved ? "Saved" : "Save to Journal"} onPress={onSave} />
        <PrimaryButton label="Ask AI" onPress={onAskAi} style={styles.actionGrow} />
      </View>
    </ScreenScroll>
  );
}

function ScoreTile({ label, value, suffix = "", risk }) {
  return (
    <View style={styles.scoreTile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.tileValue, risk && styles.riskText]}>{value}{suffix}</Text>
    </View>
  );
}

function MathItem({ label, value, risk }) {
  return (
    <View style={styles.mathItem}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.mathValue, risk && styles.riskText]}>{value}</Text>
    </View>
  );
}

function AgentRow({ agent }) {
  const color = agent.score < 60 ? palette.amber : agent.score > 72 ? palette.green : palette.teal;
  return (
    <View style={styles.agentRow}>
      <View style={styles.agentTop}>
        <View>
          <Text style={styles.agentName}>{agent.name}</Text>
          <Text style={styles.agentRead}>{agent.read}</Text>
        </View>
        <Text style={[styles.agentScore, { color }]}>{agent.score}</Text>
      </View>
      <View style={styles.agentTrack}>
        <View style={[styles.agentFill, { width: `${agent.score}%`, backgroundColor: color }]} />
      </View>
      <Text style={sharedText.bodyText}>{agent.evidence}</Text>
    </View>
  );
}

function MapList({ title, items, good }) {
  return (
    <View style={styles.mapBlock}>
      <Text style={styles.mapTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item} style={styles.mapItem}>
          <Ionicons name={good ? "checkmark-circle" : "alert-circle"} size={15} color={good ? palette.green : palette.amber} />
          <Text style={styles.mapText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function money(value) {
  const number = Number(value || 0);
  const sign = number < 0 ? "-" : "";
  return `${sign}$${Math.abs(number).toLocaleString()}`;
}

const styles = StyleSheet.create({
  methodology: {
    backgroundColor: "#FFFDF7",
    borderColor: "#FDE7B5",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  methodologyText: {
    color: "#92400E",
    fontSize: 11,
    fontWeight: "800"
  },
  briefCard: {
    backgroundColor: "#FBFFFC"
  },
  rowBetween: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10
  },
  overall: {
    flex: 1,
    color: palette.dark,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 25
  },
  weakPill: {
    width: 112,
    borderRadius: 16,
    backgroundColor: palette.amberSoft,
    borderWidth: 1,
    borderColor: "#FDE7B5",
    padding: 10
  },
  weakLabel: {
    color: "#92400E",
    fontSize: 9,
    fontWeight: "900",
    marginBottom: 4
  },
  weakText: {
    color: palette.dark,
    fontSize: 12,
    fontWeight: "900"
  },
  snapshotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  scoreTile: {
    width: "48.3%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "#FCFDFC",
    padding: 13
  },
  tileLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 5
  },
  tileValue: {
    color: palette.dark,
    fontSize: 21,
    fontWeight: "900"
  },
  mathGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  mathItem: {
    width: "31.3%",
    minHeight: 76,
    borderRadius: 14,
    backgroundColor: "#F8FAF8",
    borderWidth: 1,
    borderColor: palette.border,
    padding: 10,
    justifyContent: "center"
  },
  mathValue: {
    color: palette.dark,
    fontSize: 15,
    fontWeight: "900"
  },
  riskText: {
    color: palette.red
  },
  agentRow: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 12,
    marginTop: 12
  },
  agentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center"
  },
  agentName: {
    color: palette.dark,
    fontSize: 14,
    fontWeight: "900"
  },
  agentRead: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2
  },
  agentScore: {
    fontSize: 22,
    fontWeight: "900"
  },
  agentTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ECF0ED",
    overflow: "hidden",
    marginVertical: 9
  },
  agentFill: {
    height: "100%"
  },
  conflict: {
    color: palette.dark,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 12
  },
  mapBlock: {
    marginTop: 10
  },
  mapTitle: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 7
  },
  mapItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 8
  },
  mapText: {
    flex: 1,
    color: palette.dark,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17
  },
  questionRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingVertical: 10
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.greenSoft,
    color: palette.green,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 12,
    fontWeight: "900"
  },
  questionText: {
    flex: 1,
    color: palette.dark,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  actionGrow: {
    flex: 1
  }
});
