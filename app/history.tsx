import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Trash2 } from "lucide-react-native";
import { createStyles, theme } from "../src/theme";
import { RiskBadge } from "../src/components/ui";
import { listScreenings, clearScreenings, ScreeningRecord } from "../src/lib/storage";

export default function History() {
  const router = useRouter();
  const s = useStyles();
  const [items, setItems] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    listScreenings()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleClear = async () => {
    await clearScreenings();
    load();
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "bottom"]}>
      <View style={s.header}>
        <Pressable style={s.iconButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={theme.colors.text} />
        </Pressable>
        <Text style={s.title}>History</Text>
        <Pressable style={s.iconButton} onPress={handleClear}>
          <Trash2 size={17} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>No screenings yet. Run one from the home screen.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            {!!item.imageUri && <Image source={{ uri: item.imageUri }} style={s.thumb} />}
            <View style={{ flex: 1 }}>
              <Text style={s.date}>
                {new Date(item.createdAt).toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
              <View style={{ height: 6 }} />
              <RiskBadge level={item.riskLevel} confidence={item.confidence} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: t.spacing(4),
    paddingTop: t.spacing(3),
    paddingBottom: t.spacing(4),
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  title: { ...t.font.h2, color: t.colors.text },
  listContent: { paddingHorizontal: t.spacing(5), paddingBottom: t.spacing(10) },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.border,
    padding: t.spacing(3.5),
    marginBottom: t.spacing(3),
  },
  thumb: { width: 48, height: 48, borderRadius: 24 },
  date: { color: t.colors.text, fontSize: 13.5, fontWeight: "600" },
  empty: { paddingTop: t.spacing(20), alignItems: "center" },
  emptyText: { color: t.colors.textFaint, fontSize: 14, textAlign: "center", paddingHorizontal: t.spacing(8) },
}));
