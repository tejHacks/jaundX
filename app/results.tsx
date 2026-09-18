import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanLine, Check } from "lucide-react-native";
import { createStyles, theme, riskColors } from "../src/theme";
import { PrimaryButton, RiskBadge, DisclaimerBanner } from "../src/components/ui";
import { saveScreening } from "../src/lib/storage";
import { RiskLevel } from "../src/lib/analysis";

export default function Results() {
  const router = useRouter();
  const s = useStyles();
  const params = useLocalSearchParams<{
    imageUri: string;
    level: RiskLevel;
    confidence: string;
    headline: string;
    recommendation: string;
  }>();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const level = (params.level ?? "low") as RiskLevel;
  const confidence = Number(params.confidence ?? 0);
  const colors = riskColors(level);

  const handleSave = async () => {
    if (saved || saving) return;
    setSaving(true);
    try {
      await saveScreening({
        riskLevel: level,
        confidence,
        note: params.headline ?? "",
        imageUri: params.imageUri ?? "",
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.imageWrap}>
          {!!params.imageUri && <Image source={{ uri: params.imageUri }} style={s.image} />}
        </View>

        <RiskBadge level={level} confidence={confidence} />

        <Text style={s.headline}>{params.headline}</Text>

        <View style={[s.recCard, { borderColor: colors.fg + "35", backgroundColor: colors.bg }]}>
          <Text style={s.recLabel}>What to do next</Text>
          <Text style={s.recBody}>{params.recommendation}</Text>
        </View>

        <View style={{ height: theme.spacing(5) }} />

        {saved ? (
          <View style={s.savedRow}>
            <Check size={16} color={theme.colors.low} />
            <Text style={s.savedText}>Saved to history</Text>
          </View>
        ) : (
          <PrimaryButton
            label="Save to history"
            variant="ghost"
            loading={saving}
            onPress={handleSave}
          />
        )}

        <View style={{ height: theme.spacing(3) }} />

        <PrimaryButton
          label="New screening"
          icon={<ScanLine size={18} color="#0B0F14" />}
          onPress={() => router.replace("/capture")}
        />

        <View style={{ height: theme.spacing(6) }} />
        <DisclaimerBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.background },
  scroll: { padding: t.spacing(5), paddingTop: t.spacing(6) },
  imageWrap: { alignItems: "center", marginBottom: t.spacing(5) },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  headline: { ...t.font.h2, color: t.colors.text, marginTop: t.spacing(4), marginBottom: t.spacing(4) },
  recCard: { borderWidth: 1, borderRadius: t.radius.md, padding: t.spacing(4) },
  recLabel: { ...t.font.eyebrow, color: t.colors.textMuted, marginBottom: t.spacing(2) },
  recBody: { ...t.font.body, color: t.colors.text },
  savedRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: t.spacing(3.5) },
  savedText: { color: t.colors.low, fontWeight: "600", fontSize: 14 },
}));
