import { useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const STEPS = [
  {
    emoji: "🤱🏾",
    title: "Your Loving\nCompanion",
    subtitle:
      "A supportive partner designed specifically for your motherhood journey, from pregnancy to parenting.",
    bg: "#FFF5F7",
    accent: "#FF6B9D",
    cardBg: "#FFE4ED",
  },
  {
    emoji: "📊",
    title: "Track with\nEase",
    subtitle:
      "Growth, routines, and expenses — all in one place. Keeping everything organised has never been simpler.",
    bg: "#FFF5F7",
    accent: "#FF6B9D",
    cardBg: "#FFE4ED",
    features: [
      { icon: "📈", label: "Growth Tracking", sub: "62cm · 8.4kg" },
      { icon: "🍼", label: "Baby Scheduler", sub: "Nap time in 15m" },
      { icon: "💰", label: "Expense Tracker", sub: "Monthly budget set" },
    ],
  },
  {
    emoji: "🤖",
    title: "Meet\nMamaBot",
    subtitle:
      "Your personal AI assistant, here 24/7 for tailored tips, nutritious recipes, and smart health checks like our jaundice predictor.",
    bg: "#FFF5F7",
    accent: "#FF6B9D",
    cardBg: "#FFE4ED",
    features: [
      { icon: "🍽️", label: "Recipes" },
      { icon: "🩺", label: "Health Checks" },
      { icon: "💡", label: "Expert Tips" },
    ],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (next: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(next);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      goTo(step + 1);
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1);
  };

  const current = STEPS[step];

  return (
    <View style={{ flex: 1, backgroundColor: current.bg }}>
      {/* Skip */}
      <View className="flex-row justify-end pt-14 px-6">
        {step < STEPS.length - 1 ? (
          <Pressable onPress={() => router.replace("/(tabs)")}>
            <Text className="text-[#AA7788] text-sm font-medium">Skip</Text>
          </Pressable>
        ) : (
          <View className="h-5" />
        )}
      </View>

      {/* Floating hearts */}
      <View className="absolute top-20 left-6 right-6 flex-row justify-between pointer-events-none">
        <Text className="text-sm text-[#FFB3CC]/70">♥</Text>
        <Text className="text-[10px] text-[#FF6B9D]/50 mt-6">♥</Text>
        <Text className="text-lg text-[#FFD6E7]/60">♥</Text>
      </View>

      {/* Main content */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="flex-1 items-center justify-center px-7"
      >
        {/* Card */}
        <View
          style={{ backgroundColor: current.cardBg }}
          className="w-[180px] h-[180px] rounded-[32px] border-2 border-[#FFBBD4] items-center justify-center mb-8"
        >
          {step === 0 && <Text className="text-[72px]">🤱🏾</Text>}

          {step === 1 && (
            <View className="gap-2 w-full px-4">
              {current.features?.map((f, i) => (
                <View
                  key={i}
                  className="flex-row items-center bg-white rounded-[10px] py-1.5 px-2.5 gap-2"
                >
                  <Text className="text-sm">{f.icon}</Text>
                  <View>
                    <Text className="text-[11px] font-semibold text-[#5a3344]">
                      {f.label}
                    </Text>
                    {f.sub && (
                      <Text className="text-[9px] text-[#AA7788]">{f.sub}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {step === 2 && (
            <View className="items-center gap-2.5">
              <View className="w-[60px] h-[60px] rounded-2xl bg-white items-center justify-center border border-[#FFBBD4]">
                <Text className="text-[28px]">🤖</Text>
              </View>

              <Text className="text-[11px] text-[#AA4466] font-semibold">
                MamaBot
              </Text>

              <View className="flex-row gap-1.5">
                {current.features?.map((f, i) => (
                  <View
                    key={i}
                    className="bg-white rounded-lg p-1.5 items-center gap-0.5"
                  >
                    <Text className="text-xs">{f.icon}</Text>
                    <Text className="text-[8px] text-[#AA7788]">{f.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Title */}
        <Text className="text-[34px] font-bold text-[#FF6B9D] text-center leading-10 mb-3.5">
          {current.title}
        </Text>

        {/* Subtitle */}
        <Text className="text-[15px] text-[#AA5566] text-center leading-[23px] max-w-[300px]">
          {current.subtitle}
        </Text>
      </Animated.View>

      {/* Dots */}
      <View className="flex-row justify-center gap-2 mb-7">
        {STEPS.map((_, i) => (
          <Pressable key={i} onPress={() => goTo(i)}>
            <View
              className={`h-2 rounded-full ${
                i === step ? "w-6 bg-[#FF6B9D]" : "w-2 bg-[#FFBBD4]"
              }`}
            />
          </Pressable>
        ))}
      </View>

      {/* Buttons */}
      <View
        className={`px-6 pb-12 gap-3 ${step > 0 ? "flex-row" : "flex-col"}`}
      >
        {step > 0 && (
          <Pressable
            onPress={handleBack}
            className="flex-1 py-4 rounded-full items-center border-[1.5px] border-[#FFBBD4]"
          >
            <Text className="text-[#FF6B9D] text-[15px] font-semibold">
              Back
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={handleNext}
          className="flex-1 py-4 rounded-full items-center bg-[#FF6B9D] active:scale-95"
        >
          <Text className="text-white text-[15px] font-semibold">
            {step === STEPS.length - 1 ? "Get Started" : "Next →"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
