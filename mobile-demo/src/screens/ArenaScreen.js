import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { ArenaChart } from "../components/LineChart";
import { ChipRow, Header, ScreenScroll, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function ArenaScreen({ arena }) {
  return (
    <ScreenScroll>
      <Header title="Options Agent Replay" subtitle="Replay the experiment that shaped the app." />
      <ChipRow items={["Overview", "Equity Curves", "Agents", "Results"]} active="Overview" />
      <Card>
        <Text style={sharedText.sectionTitle}>Equity Curve Comparison</Text>
        <Text style={sharedText.bodyText}>Raw options nearly 4x'd, then collapsed. Risk rules preserved gains.</Text>
        <ArenaChart arena={arena} />
        {arena.agents.map(([name, value, color]) => (
          <View style={styles.legendRow} key={name}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{name}</Text>
            <Text style={[styles.legendValue, { color }]}>{value}</Text>
          </View>
        ))}
      </Card>
      <Card style={styles.takeaway}>
        <Text style={sharedText.mediumTitle}>Key Takeaway</Text>
        <Text style={sharedText.bodyText}>Risk management preserved gains and avoided catastrophic drawdowns. Rules beat impulse.</Text>
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8
  },
  legendText: {
    flex: 1,
    color: palette.dark,
    fontSize: 12,
    fontWeight: "800"
  },
  legendValue: {
    fontWeight: "900"
  },
  takeaway: {
    backgroundColor: "#FBFFFC"
  }
});
