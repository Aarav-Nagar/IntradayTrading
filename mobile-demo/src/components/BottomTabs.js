import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/theme";

export const tabs = [
  ["Check", "C"],
  ["Report", "R"],
  ["Journal", "J"],
  ["Growth", "G"],
  ["Arena", "A"],
  ["Learn", "L"],
  ["Profile", "P"]
];

export function BottomTabs({ activeTab, setActiveTab }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map(([name, icon]) => (
        <Pressable key={name} style={styles.tabItem} onPress={() => setActiveTab(name)}>
          <Text style={[styles.tabIcon, activeTab === name && styles.active]}>{icon}</Text>
          <Text style={[styles.tabLabel, activeTab === name && styles.active]}>{name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 74,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: palette.border
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  tabIcon: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900"
  },
  tabLabel: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 4
  },
  active: {
    color: palette.green
  }
});

