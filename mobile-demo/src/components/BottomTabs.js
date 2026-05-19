import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "../theme/theme";

export const tabs = [
  ["Home", "home"],
  ["Search", "search"],
  ["Check", "location-outline"],
  ["Alerts", "notifications-outline"],
  ["Profile", "person-outline"]
];

export function BottomTabs({ activeTab, setActiveTab, disabledTabs = [] }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map(([name, icon]) => {
        const isCenter = name === "Check";
        const homeSubPages = ["Journal", "Growth", "Arena", "Learn"];
        const isActive = activeTab === name || (isCenter && activeTab === "Report") || (name === "Home" && homeSubPages.includes(activeTab));
        return (
        <Pressable
          key={name}
          style={[styles.tabItem, isCenter && styles.centerTab, disabledTabs.includes(name) && styles.disabled]}
          onPress={() => !disabledTabs.includes(name) && setActiveTab(name)}
        >
          <View style={[styles.iconWrap, isCenter && styles.centerIconWrap, isActive && !isCenter && styles.iconActive]}>
            <Ionicons
              name={icon}
              size={isCenter ? 29 : 22}
              color={isCenter ? "#FFFFFF" : isActive ? palette.green : "#A3AEA6"}
            />
          </View>
          {!isCenter ? <Text style={[styles.tabLabel, isActive && styles.active]}>{name}</Text> : null}
        </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 82,
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 9,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAF0EA",
    borderRadius: 34,
    shadowColor: "#16351D",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 }
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0
  },
  centerTab: {
    justifyContent: "flex-start",
    paddingTop: 0
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center"
  },
  iconActive: {
    backgroundColor: "#F0FAF2"
  },
  centerIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#8AC94B",
    marginTop: -26,
    borderWidth: 6,
    borderColor: "#FFFFFF",
    shadowColor: "#8AC94B",
    shadowOpacity: 0.42,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  tabLabel: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 3
  },
  active: {
    color: palette.green
  },
  disabled: {
    opacity: 0.35
  }
});
