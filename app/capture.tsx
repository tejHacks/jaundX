import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ImageUp, RefreshCw, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../src/components/ui";
import { createStyles, theme } from "../src/theme";

export default function Capture() {
  const router = useRouter();
  const s = useStyles();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [capturing, setCapturing] = useState(false);
  const [picking, setPicking] = useState(false);

  if (!permission) {
    return <SafeAreaView style={s.safe} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.permissionWrap}>
          <Text style={s.permissionTitle}>Camera access needed</Text>
          <Text style={s.permissionBody}>
            JaundX uses the camera to capture a screening image. Nothing is uploaded — the image
            stays on this device.
          </Text>
          <PrimaryButton label="Allow camera" onPress={requestPermission} />
          <View style={{ height: theme.spacing(2) }} />
          <PrimaryButton label="Not now" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
      if (photo?.uri) {
        router.replace({ pathname: "/analyzing", params: { imageUri: photo.uri } });
      }
    } finally {
      setCapturing(false);
    }
  };

  const handlePickImage = async () => {
    if (picking || capturing) return;
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

  return (
    <View style={s.safe}>
      <CameraView ref={cameraRef} style={s.camera} facing={facing}>
        <SafeAreaView style={s.overlay} edges={["top", "bottom"]}>
          <View style={s.topBar}>
            <Pressable style={s.iconButton} onPress={() => router.back()}>
              <X size={20} color="#fff" />
            </Pressable>
            <Pressable
              style={s.iconButton}
              onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
            >
              <RefreshCw size={18} color="#fff" />
            </Pressable>
          </View>

          <View style={s.frameGuide}>
            <Text style={s.guideText}>
              Frame the baby’s skin or eyes in good, natural light
            </Text>
          </View>

          <View style={s.bottomBar}>
            <View style={s.uploadButton}>
              <PrimaryButton
                label="Choose from photos"
                icon={<ImageUp size={17} color={theme.colors.text} />}
                onPress={handlePickImage}
                loading={picking}
                variant="ghost"
              />
            </View>
            <Pressable style={s.shutterOuter} onPress={handleCapture} disabled={capturing}>
              <View style={[s.shutterInner, capturing && s.shutterCapturing]} />
            </Pressable>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: "space-between" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: t.spacing(5),
    paddingTop: t.spacing(3),
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  frameGuide: { alignItems: "center", paddingHorizontal: t.spacing(10) },
  guideText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: t.spacing(3),
    paddingVertical: t.spacing(1.5),
    borderRadius: t.radius.pill,
    overflow: "hidden",
  },
  bottomBar: { alignItems: "center", paddingBottom: t.spacing(6), gap: t.spacing(4) },
  uploadButton: { width: 210 },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff" },
  shutterCapturing: { backgroundColor: t.colors.accent },
  permissionWrap: { flex: 1, justifyContent: "center", padding: t.spacing(6) },
  permissionTitle: { ...t.font.h2, color: t.colors.text, marginBottom: t.spacing(2) },
  permissionBody: {
    ...t.font.body,
    color: t.colors.textMuted,
    marginBottom: t.spacing(6),
  },
}));
