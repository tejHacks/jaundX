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
      toValue: 0.94,
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
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 40,
    textShadowColor: "#93C5FD",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#1E40AF",
    fontWeight: "600",
  },
  reference: {
    fontSize: 16,
    color: "#3B82F6",
    marginTop: 4,
    marginBottom: 40,
  },
  buttonContainer: {
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
