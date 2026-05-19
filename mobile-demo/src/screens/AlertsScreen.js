import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/Card";
import { Header, ScreenScroll, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

const defaultAlerts = [
  ["Position Size", "Keep planned risk inside the budget before entering.", "shield-checkmark-outline"],
  ["Exit Plan", "Write the invalidation level before reviewing the report.", "exit-outline"],
  ["Volatility", "Check whether event volatility is driving the premium.", "pulse-outline"],
  ["Journal Review", "Review the last losing trade before the next high-risk setup.", "book-outline"]
];

export function AlertsScreen({ user, stats, navigate }) {
  const reminders = user?.reminders?.length ? user.reminders : ["Position size", "Risk/reward", "Exit plan"];

  return (
    <ScreenScroll>
      <Header title="Alerts" subtitle="Behavior reminders before the trade." />
      <Card style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="notifications-outline" size={22} color={palette.green} />
        </View>
        <Text style={styles.heroTitle}>Keep the system in the loop.</Text>
        <Text style={sharedText.bodyText}>
          V1 uses local reminders and risk prompts. Later, this can become push notifications around watchlist events and journal patterns.
        </Text>
      </Card>

      <Card>
        <Text style={sharedText.sectionTitle}>Your Reminder Themes</Text>
        <View style={styles.chips}>
          {reminders.map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      </Card>

      {defaultAlerts.map(([title, text, icon]) => (
        <Pressable key={title} style={styles.alertCard} onPress={() => navigate(title === "Journal Review" ? "Journal" : "Check")}>
          <View style={styles.alertIcon}>
            <Ionicons name={icon} size={20} color={palette.green} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={sharedText.bodyText}>{text}</Text>
          </View>
          <Text style={styles.chevron}>&gt;</Text>
        </Pressable>
      ))}

      <Card style={styles.scoreCard}>
        <Text style={sharedText.sectionTitle}>Discipline Snapshot</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{stats.disciplineScore}</Text>
          <View style={styles.flex}>
            <Text style={styles.scoreTitle}>Stable habits beat one-off guesses.</Text>
            <Text style={sharedText.bodyText}>The app should help you pause, size, and review instead of rushing into every setup.</Text>
          </View>
        </View>
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#FBFFFC"
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: palette.greenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  heroTitle: {
    color: palette.dark,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 7
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 11,
    backgroundColor: palette.greenSoft,
    borderWidth: 1,
    borderColor: "#CFEFD8"
  },
  chipText: {
    color: palette.green,
    fontSize: 11,
    fontWeight: "900"
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 18,
    padding: 15,
    marginBottom: 12
  },
  alertIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3FFF6",
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    flex: 1
  },
  alertTitle: {
    color: palette.dark,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3
  },
  chevron: {
    color: palette.muted,
    fontSize: 18
  },
  scoreCard: {
    backgroundColor: "#FBFFFC"
  },
  scoreRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center"
  },
  score: {
    color: palette.green,
    fontSize: 42,
    fontWeight: "900"
  },
  scoreTitle: {
    color: palette.dark,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5
  }
});
