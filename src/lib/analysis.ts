/**
 * STUB analysis engine.
 *
 * This intentionally does NOT ship a real TFLite model — Expo Go / a bare
 * managed workflow can't load a custom .tflite graph without a config plugin
 * and a dev client build, and that's outside "make the screens work."
 *
 * `analyzeImage()` is the single swap-in point: replace its body with a
 * real inference call (e.g. react-native-fast-tflite or an API call to your
 * model server) and every screen that consumes it keeps working unchanged,
 * since the RiskResult shape stays the same.
 */

export type RiskLevel = "low" | "moderate" | "high";

export interface RiskResult {
  level: RiskLevel;
  confidence: number; // 0-1
  headline: string;
  recommendation: string;
}

const RESULT_BANK: Record<RiskLevel, Omit<RiskResult, "confidence">> = {
  low: {
    level: "low",
    headline: "No strong signs of jaundice detected",
    recommendation:
      "Skin tone looks within a typical range. Keep an eye out over the next 24–48 hours and re-screen if the skin or eyes look more yellow.",
  },
  moderate: {
    level: "moderate",
    headline: "Some signs consistent with mild jaundice",
    recommendation:
      "There are early indicators worth monitoring closely. Re-screen in 12 hours, and check with a nurse or doctor sooner if feeding, alertness, or color changes.",
  },
  high: {
    level: "high",
    headline: "Signs consistent with elevated jaundice risk",
    recommendation:
      "This result suggests a higher likelihood of significant jaundice. This is a screening estimate, not a diagnosis — please have a clinician confirm with a bilirubin test as soon as possible.",
  },
};

/**
 * Fake but deterministic-ish "inference": hashes the image URI so the same
 * capture returns the same result during a demo, while different captures
 * vary the outcome for a believable walkthrough.
 */
export async function analyzeImage(imageUri: string): Promise<RiskResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  let hash = 0;
  for (let i = 0; i < imageUri.length; i++) {
    hash = (hash * 31 + imageUri.charCodeAt(i)) >>> 0;
  }

  const roll = hash % 100;
  const level: RiskLevel = roll < 55 ? "low" : roll < 85 ? "moderate" : "high";
  const confidence = 0.72 + ((hash % 23) / 100); // 0.72–0.95

  return { ...RESULT_BANK[level], confidence: Math.min(confidence, 0.97) };
}
