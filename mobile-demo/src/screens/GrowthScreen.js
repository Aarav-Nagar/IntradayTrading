import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { LineChart } from "../components/LineChart";
import { AiCard, ChipRow, Header, ScreenScroll, StatCard, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function GrowthScreen({ stats }) {
  return (
    <ScreenScroll>
      <Header kicker="4. GROWTH" title="Growth" subtitle="Track performance and behavioral insights." right={<Text style={styles.bell}>cal</Text>} />
      <ChipRow items={["1W", "1M", "3M", "6M", "1Y", "All"]} active="3M" />
      <Card>
        <Text style={sharedText.cardLabel}>Account Curve</Text>
        <View style={styles.rowBaseline}>
          <Text style={styles.heroValue}>{stats.value}</Text>
          <Text style={[styles.returnText, stats.return.startsWith("-") && styles.riskText]}>{stats.return}</Text>
        </View>
        <LineChart points={stats.curve} color={palette.green} fill />
      </Card>
      <View style={styles.metricsGrid}>
        <StatCard label="Win Rate" value={stats.winRate} sub="closed checks" />
        <StatCard label="Avg Win" value={stats.avgWin} good sub="winners" />
        <StatCard label="Avg Loss" value={stats.avgLoss} risk sub="losers" />
        <StatCard label="Profit Factor" value={stats.profitFactor} />
        <StatCard label="Max Drawdown" value={stats.maxDrawdown} risk />
        <StatCard label="Discipline Score" value={`${stats.disciplineScore}/100`} good />
      </View>
      <AiCard text="Your discipline score is improving. Best performance comes when you wait for high-quality setups." compact />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  bell: {
    color: palette.dark,
    fontSize: 12,
    fontWeight: "900"
  },
  rowBaseline: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10
  },
  heroValue: {
    color: palette.dark,
    fontSize: 31,
    fontWeight: "900"
  },
  returnText: {
    color: palette.green,
    fontSize: 16,
    fontWeight: "900"
  },
  riskText: {
    color: palette.red
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});

