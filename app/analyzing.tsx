import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ImageUp } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../src/components/ui";
import { analyzeImage } from "../src/lib/analysis";
import { createStyles } from "../src/theme";

const STEPS = [
  "Reading image data",
  "Checking lighting & color balance",
  "Running screening model",
  "Preparing result",
];

export default function Analyzing() {
  const router = useRouter();
  const s = useStyles();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [stepIndex, setStepIndex] = useState(0);
  const [picking, setPicking] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;
  const hasImage = typeof imageUri === "string" && imageUri.length > 0;

  const handlePickImage = async () => {
    if (picking) return;
    setPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.6,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        router.replace({ pathname: "/analyzing", params: { imageUri: result.assets[0].uri } });
      }
    } finally {
      setPicking(false);
    }
  };

  useEffect(() => {
    if (!hasImage) return;

    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    const stepInterval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 420);

    let cancelled = false;
    (async () => {
      const result = await analyzeImage(imageUri ?? "");
      if (cancelled) return;
      router.replace({
        pathname: "/results",
        params: {
          imageUri: imageUri ?? "",
          level: result.level,
          confidence: String(result.confidence),
          headline: result.headline,
          recommendation: result.recommendation,
        },
      });
    })();

    return () => {
      cancelled = true;
      animation.stop();
      clearInterval(stepInterval);
    };
  }, [hasImage, imageUri, router, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        {hasImage && (
          <View style={s.previewWrap}>
            <Image source={{ uri: imageUri }} style={s.preview} />
            <Animated.View style={[s.ring, { transform: [{ rotate }] }]} />
          </View>
        )}

        <Text style={s.title}>{hasImage ? "Analyzing screening image" : "Choose a screening image"}</Text>

        {!hasImage && (
          <View style={s.pickButton}>
            <PrimaryButton
              label="Choose from photos"
              icon={<ImageUp size={18} color="#0B0F14" />}
              onPress={handlePickImage}
              loading={picking}
            />
          </View>
        )}

        {hasImage && <View style={s.steps}>
          {STEPS.map((step, i) => (
            <Text key={step} style={[s.step, i <= stepIndex && s.stepDone]}>
              {i < stepIndex ? "✓" : i === stepIndex ? "•" : "○"}  {step}
            </Text>
          ))}
        </View>}
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: t.spacing(6) },
  previewWrap: { width: 140, height: 140, marginBottom: t.spacing(8) },
  preview: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  pickButton: { alignSelf: "stretch", marginBottom: t.spacing(6) },
  ring: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 152,
    height: 152,
    borderRadius: 76,
    borderWidth: 3,
    borderColor: t.colors.accent,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  title: { ...t.font.h2, color: t.colors.text, marginBottom: t.spacing(6) },
  steps: { alignSelf: "stretch", gap: 12 },
  step: { color: t.colors.textFaint, fontSize: 14 },
  stepDone: { color: t.colors.textMuted },
}));
