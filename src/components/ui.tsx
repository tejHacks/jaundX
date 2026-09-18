import React from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { createStyles, theme, riskColors } from "../theme";
import { RiskLevel } from "../lib/analysis";

export function PrimaryButton({
  label,
  onPress,
  icon,
  loading,
  variant = "solid",
  disabled,
}: {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  variant?: "solid" | "ghost";
  disabled?: boolean;
}) {
  const s = useButtonStyles();
  const isDisabled = disabled || loading;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  const content = (
    <View style={s.row}>
      {loading ? (
        <ActivityIndicator color={variant === "solid" ? "#0B0F14" : theme.colors.accent} />
      ) : (
        icon
      )}
      <Text style={variant === "solid" ? s.labelSolid : s.labelGhost}>{label}</Text>
    </View>
  );

  if (variant === "ghost") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={[s.ghost, isDisabled && s.disabled]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} disabled={isDisabled} style={isDisabled ? s.disabled : undefined}>
      <LinearGradient
        colors={["#FBBF24", "#F59E0B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.solid}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
}

const useButtonStyles = createStyles((t) => ({
  solid: {
    borderRadius: t.radius.pill,
    paddingVertical: t.spacing(3.5),
    alignItems: "center",
    justifyContent: "center",
  },
  ghost: {
    borderRadius: t.radius.pill,
    paddingVertical: t.spacing(3.5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: t.colors.borderStrong,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  labelSolid: { color: "#0B0F14", fontWeight: "700", fontSize: 15 },
  labelGhost: { color: t.colors.text, fontWeight: "600", fontSize: 15 },
  disabled: { opacity: 0.5 },
}));

export function RiskBadge({ level, confidence }: { level: RiskLevel; confidence?: number }) {
  const s = useBadgeStyles();
  const c = riskColors(level);
  const label = level === "low" ? "Low risk" : level === "moderate" ? "Moderate risk" : "High risk";
  return (
    <View style={[s.badge, { backgroundColor: c.bg, borderColor: c.fg + "40" }]}>
      <View style={[s.dot, { backgroundColor: c.fg }]} />
      <Text style={[s.label, { color: c.fg }]}>
        {label}
        {confidence !== undefined ? `  ·  ${Math.round(confidence * 100)}% confidence` : ""}
      </Text>
    </View>
  );
}

const useBadgeStyles = createStyles((t) => ({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: t.spacing(3),
    paddingVertical: t.spacing(1.5),
    borderRadius: t.radius.pill,
    borderWidth: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 13, fontWeight: "600" },
}));

export function DisclaimerBanner() {
  const s = useDisclaimerStyles();
  return (
    <View style={s.wrap}>
      <Text style={s.text}>
        JaundX is a screening prototype, not a diagnostic device. Always confirm results with a
        clinician and a bilirubin test.
      </Text>
    </View>
  );
}

const useDisclaimerStyles = createStyles((t) => ({
  wrap: {
    backgroundColor: t.colors.surfaceElevated,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    padding: t.spacing(3.5),
  },
  text: { color: t.colors.textMuted, fontSize: 12.5, lineHeight: 18 },
}));
