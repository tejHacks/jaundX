import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LandingPage({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatingAnim]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const floatingY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.title,
          {
            transform: [{ translateY: floatingY }],
          },
        ]}
      >
        Scribe
      </Animated.Text>

      <View style={styles.bottomContainer}>
        <Text style={styles.subtitle}>Write it down</Text>
        <Text style={styles.reference}>(Habbakuk 2:2)</Text>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: pressAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={onGetStarted}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0E5FF",
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#6D28D9",
    marginBottom: 40,
    textShadowColor: "#D1B3FF",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#5B21B6",
    fontWeight: "600",
  },
  reference: {
    fontSize: 16,
    color: "#7C3AED",
    marginTop: 4,
    marginBottom: 40,
  },
  buttonContainer: {
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
