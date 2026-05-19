import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { ChipRow, Header, ScreenScroll, sharedText } from "../components/Shared";
import { palette } from "../theme/theme";

export function LearnScreen({ lessons }) {
  return (
    <ScreenScroll>
      <Header title="Learn" subtitle="Bite-sized lessons to level up your edge." />
      <ChipRow items={["All", "Options Basics", "Risk", "Strategy", "Psychology"]} active="All" />
      {lessons.map(([title, text, time], index) => (
        <Card style={styles.lessonCard} key={title}>
          <View style={[styles.lessonIcon, index === 3 && styles.lessonIconWarn]}>
            <Text style={[styles.lessonIconText, index === 3 && styles.riskText]}>{index === 3 ? "R" : "L"}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={sharedText.mediumTitle}>{title}</Text>
            <Text style={sharedText.bodyText}>{text}</Text>
            <Text style={sharedText.microcopy}>{time}</Text>
          </View>
          <Text style={styles.chevron}>&gt;</Text>
        </Card>
      ))}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  lessonIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: palette.greenSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  lessonIconWarn: {
    backgroundColor: palette.amberSoft
  },
  lessonIconText: {
    color: palette.green,
    fontSize: 18,
    fontWeight: "900"
  },
  riskText: {
    color: palette.red
  },
  flex: {
    flex: 1
  },
  chevron: {
    color: palette.muted,
    fontSize: 20
  }
});
