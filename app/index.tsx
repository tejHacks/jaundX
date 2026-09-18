import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanLine, History as HistoryIcon, ChevronRight } from "lucide-react-native";
import { createStyles, theme } from "../src/theme";
import { PrimaryButton, RiskBadge, DisclaimerBanner } from "../src/components/ui";
import { listScreenings, ScreeningRecord } from "../src/lib/storage";

export default function Home() {
  const router = useRouter();
  const s = useStyles();
  const [recent, setRecent] = useState<ScreeningRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listScreenings()
        .then((rows) => active && setRecent(rows.slice(0, 3)))
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.eyebrow}>Jaundice screening</Text>
          <Text style={s.title}>JaundX</Text>
          <Text style={s.subtitle}>
            A quick camera-based check to help you keep an eye on newborn jaundice between
            clinical visits.
          </Text>
        </View>

        <PrimaryButton
          label="Start new screening"
          icon={<ScanLine size={18} color="#0B0F14" />}
          onPress={() => router.push("/capture")}
        />

        <View style={{ height: theme.spacing(3) }} />

        <Pressable style={s.historyLink} onPress={() => router.push("/history")}>
          <View style={s.row}>
            <HistoryIcon size={16} color={theme.colors.textMuted} />
            <Text style={s.historyLinkText}>View full history</Text>
          </View>
          <ChevronRight size={16} color={theme.colors.textFaint} />
        </Pressable>

        {recent.length > 0 && (
          <View style={s.recentSection}>
            <Text style={s.sectionLabel}>Recent screenings</Text>
            {recent.map((item) => (
              <View key={item.id} style={s.recentCard}>
                <View style={{ flex: 1 }}>
                  <Text style={s.recentDate}>
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                  <View style={{ height: 6 }} />
                  <RiskBadge level={item.riskLevel} />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: theme.spacing(6) }} />
        <DisclaimerBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.background },
  scroll: { padding: t.spacing(5), paddingTop: t.spacing(8) },
  header: { marginBottom: t.spacing(8) },
  eyebrow: { ...t.font.eyebrow, color: t.colors.accent, marginBottom: t.spacing(2) },
  title: { ...t.font.h1, color: t.colors.text, marginBottom: t.spacing(2) },
  subtitle: { ...t.font.body, color: t.colors.textMuted },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  historyLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: t.spacing(3),
  },
  historyLinkText: { color: t.colors.textMuted, fontSize: 14, fontWeight: "500" },
  sectionLabel: {
    ...t.font.eyebrow,
    color: t.colors.textFaint,
    marginBottom: t.spacing(3),
    marginTop: t.spacing(2),
  },
  recentSection: { marginBottom: t.spacing(2) },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    padding: t.spacing(3.5),
    marginBottom: t.spacing(2.5),
  },
  recentDate: { color: t.colors.text, fontSize: 13.5, fontWeight: "600" },
}));
