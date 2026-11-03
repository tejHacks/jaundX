import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import "../global.css";

export default function Index() {
  const router = useRouter();

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const tagTranslate = useRef(new Animated.Value(24)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const btnTranslate = useRef(new Animated.Value(32)).current;
  const heart1Opacity = useRef(new Animated.Value(0)).current;
  const heart2Opacity = useRef(new Animated.Value(0)).current;
  const heart3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(tagOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(tagTranslate, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.stagger(100, [
          Animated.timing(heart1Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(heart2Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(heart3Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(btnOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(btnTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 bg-[#1a0a12]">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        source={require("../src/assets/images/mother-holding-her-baby-boy.jpg")}
        className="flex-1 w-full"
        resizeMode="cover"
      >
        {/* Dark overlay — bottom 65% */}
        <Animated.View
          style={{ opacity: overlayOpacity }}
          className="absolute bottom-0 left-0 right-0 h-[65%]"
        >
          <View className="absolute bottom-0 left-0 right-0 h-full bg-[#1a0a12] opacity-90 rounded-t-[32px]" />
        </Animated.View>

        {/* Floating hearts */}
        <View className="absolute top-16 left-6 right-6 flex-row justify-between">
          <Animated.Text
            style={{ opacity: heart1Opacity }}
            className="text-[18px] text-[#FFB3CC]"
          >
            ♥
          </Animated.Text>
          <Animated.Text
            style={{ opacity: heart2Opacity }}
            className="text-[12px] text-[#FF6B9D] mt-5"
          >
            ♥
          </Animated.Text>
          <Animated.Text
            style={{ opacity: heart3Opacity }}
            className="text-[22px] text-[#FFD6E7]"
          >
            ♥
          </Animated.Text>
        </View>

        {/* Bottom content */}
        <View className="absolute bottom-0 left-0 right-0 px-7 pb-12 pt-9">
          {/* Badge + text */}
          <Animated.View
            style={{
              opacity: tagOpacity,
              transform: [{ translateY: tagTranslate }],
            }}
            className="items-center mb-2"
          >
            {/* App badge pill */}
            <View className="flex-row items-center bg-[#FF6B9D]/20 rounded-full px-4 py-1.5 border border-[#FF6B9D]/30 mb-4">
              <Text className="text-[11px] text-[#FFB3CC] tracking-[1.5px]">
                ♥ LUMICARE
              </Text>
            </View>

            {/* Headline */}
            <Text className="text-[38px] font-bold text-white text-center leading-[46px] mb-2">
              Your Loving{"\n"}
              <Text className="text-[#FF6B9D]">Companion</Text>
            </Text>

            {/* Subtitle */}
            <Text className="text-[15px] text-[#FFC8D7]/80 text-center leading-[22px] max-w-[280px] mb-2">
              From bump to baby steps — every moment of motherhood, beautifully
              supported.
            </Text>

            {/* Divider */}
            <View className="flex-row items-center gap-2.5 mt-3 mb-1">
              <View className="h-px w-14 bg-[#FF6B9D]/40" />
              <Text className="text-[12px] text-[#FF6B9D]">♥</Text>
              <View className="h-px w-14 bg-[#FF6B9D]/40" />
            </View>

            <Text className="text-[12px] text-[#FFB4C8]/60 italic text-center">
              Wrapped in love
            </Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            style={{
              opacity: btnOpacity,
              transform: [{ translateY: btnTranslate }],
            }}
            className="gap-3 mt-6"
          >
            {/* Get Started */}
            <Pressable
              onPress={() => router.push("/onboarding")}
              className="bg-[#FF6B9D] rounded-full items-center py-[17px] active:opacity-90"
            >
              <Text className="text-white text-[16px] font-semibold tracking-wide">
                Get Started →
              </Text>
            </Pressable>

            {/* Sign in */}
            <Pressable
              onPress={() => router.push("/auth/login")}
              className="rounded-full items-center py-[14px] border border-[#FF6B9D]/40 active:bg-[#FF6B9D]/10"
            >
              <Text className="text-[#FFC8D7]/90 text-[15px]">
                Already a mama?{" "}
                <Text className="text-[#FF6B9D] font-semibold">Sign in</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}
