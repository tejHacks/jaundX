import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.base} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title || "Tap Me (Android) "}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#2196F3",
    borderRadius: 4,
    alignItems: "center",
    elevation: 4,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
