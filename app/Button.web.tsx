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
    <TouchableOpacity style={styles.base} onPress={onPress}>
      <Text style={styles.text}>{title || "Click Me (Web) "}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 20,
    paddingHorizontal: 64,
    backgroundColor: "#FF6B6B",
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#C92A2A",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "none",
  },
});
