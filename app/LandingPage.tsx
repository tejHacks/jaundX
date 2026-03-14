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
      toValue: 0.95,
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
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  reference: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginBottom: 40,
  },
  buttonContainer: {
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    paddingVertical: 34,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
