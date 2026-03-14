import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LandingPage from "./LandingPage";
import { fetchRandomJoke } from "./utils/api";

export default function Index() {
  const [joke, setJoke] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    alert("Welcome to Scribe! Let's start writing...");
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRandomJoke();
        setJoke(data.joke);
      } catch (e: any) {
        console.error("failed to fetch joke", e);
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LandingPage onGetStarted={handleGetStarted} />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading joke…</Text>
        </View>
      )}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
      {!loading && !error && joke && (
        <View style={styles.jokeContainer}>
          <Text style={styles.jokeTitle}>Random Joke:</Text>
          <Text style={styles.jokeText}>{joke}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// Base styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  jokeContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  jokeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  jokeText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#C00",
    textAlign: "center",
  },
});
