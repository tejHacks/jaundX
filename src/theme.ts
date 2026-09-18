/**
 * Central theme + createStyles factory.
 * Pattern: components call `useTheme()` for tokens and
 * `createStyles(theme => StyleSheet.create({...}))` for style objects
 * so styles stay in sync with the theme without re-deriving colors inline.
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export const theme = {
  colors: {
    background: "#0B0F14",
    surface: "#131A22",
    surfaceElevated: "#1A2129",
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.16)",
    text: "#F5F7FA",
    textMuted: "rgba(245,247,250,0.55)",
    textFaint: "rgba(245,247,250,0.3)",
    accent: "#F59E0B", // JaundX brand amber
    accentSoft: "rgba(245,158,11,0.12)",
    low: "#34D399",
    lowSoft: "rgba(52,211,153,0.12)",
    moderate: "#FBBF24",
    moderateSoft: "rgba(251,191,36,0.12)",
    high: "#F87171",
    highSoft: "rgba(248,113,113,0.12)",
  },
  radius: { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 },
  spacing: (n: number) => n * 4,
  font: {
    eyebrow: { fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" as const },
    h1: { fontSize: 30, fontWeight: "700" as const },
    h2: { fontSize: 22, fontWeight: "700" as const },
    body: { fontSize: 15, lineHeight: 22 },
    small: { fontSize: 13, lineHeight: 18 },
  },
};

export type Theme = typeof theme;

export function useTheme(): Theme {
  // Static for now — swap for a context/provider later if light mode is added.
  return theme;
}

export function createStyles<T extends Record<string, any>>(
  factory: (theme: Theme) => T
): () => T {
  return function useStyles() {
    const t = useTheme();
    return useMemo(() => StyleSheet.create(factory(t)), [t]);
  };
}

export function riskColors(level: "low" | "moderate" | "high") {
  if (level === "low") return { fg: theme.colors.low, bg: theme.colors.lowSoft };
  if (level === "moderate") return { fg: theme.colors.moderate, bg: theme.colors.moderateSoft };
  return { fg: theme.colors.high, bg: theme.colors.highSoft };
}
