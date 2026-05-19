import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette } from "../theme/theme";

export function LineChart({ points, color = palette.green, fill }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const normalized = points.map((point, index) => ({
    x: (index / Math.max(points.length - 1, 1)) * 100,
    y: 100 - ((point - min) / (max - min || 1)) * 74 - 12
  }));

  return (
    <View style={styles.chart}>
      {fill ? <View style={styles.fill} /> : null}
      {normalized.slice(1).map((point, index) => {
        const prev = normalized[index];
        return <View key={`${point.x}-${point.y}`} style={[styles.line, segmentStyle(prev, point, color)]} />;
      })}
      <View style={styles.axis} />
    </View>
  );
}

export function ArenaChart({ arena }) {
  return (
    <View style={styles.arenaChart}>
      <LineChart points={arena.rawPath} color={palette.red} />
      <View style={styles.overlay}>
        <LineChart points={arena.managedPath} color={palette.green} />
      </View>
      <Text style={styles.note}>raw agent climbed fast, then collapsed</Text>
    </View>
  );
}

function segmentStyle(a, b, color) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return {
    left: `${a.x}%`,
    top: `${a.y}%`,
    width: `${length}%`,
    backgroundColor: color,
    transform: [{ rotate: `${angle}deg` }]
  };
}

const styles = StyleSheet.create({
  chart: {
    height: 190,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "#FAFCFA",
    overflow: "hidden",
    position: "relative"
  },
  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "58%",
    backgroundColor: "#E5F7EA"
  },
  line: {
    position: "absolute",
    height: 3,
    borderRadius: 99,
    transformOrigin: "0% 50%"
  },
  axis: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 24,
    height: 1,
    backgroundColor: "#E7ECE8"
  },
  arenaChart: {
    position: "relative",
    marginTop: 10
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  note: {
    position: "absolute",
    right: 8,
    top: 18,
    color: palette.red,
    fontSize: 10,
    fontWeight: "900",
    width: 110,
    textAlign: "right"
  }
});

