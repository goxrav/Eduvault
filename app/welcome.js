import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg: "#080812",
  surface: "#10101E",
  card: "#16162A",
  border: "#1E1E36",
  accent: "#7C3AED",
  accentMid: "#6D28D9",
  accentLight: "#A78BFA",
  accentGlow: "#7C3AED33",
  textPrimary: "#F0EFF8",
  textSecondary: "#8B8BA8",
  textMuted: "#44445A",
  white: "#FFFFFF",
};

// ─── FEATURE PILLS ───────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "📚", label: "Branch-wise Notes" },
  { icon: "🔍", label: "Search & Filter" },
  { icon: "⬇️", label: "Instant Download" },
  { icon: "🔒", label: "Secure & Private" },
];

// ─── ANIMATED DOT (background decoration) ────────────────────────────────────
const GlowOrb = ({ style }) => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.75, duration: 2800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 2800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[style, { opacity: pulse }]} />;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Welcome() {
  const router = useRouter();

  // entrance animations
  const fadeTop = useRef(new Animated.Value(0)).current;
  const slideTop = useRef(new Animated.Value(-24)).current;
  const fadeMid = useRef(new Animated.Value(0)).current;
  const slideMid = useRef(new Animated.Value(20)).current;
  const fadeBottom = useRef(new Animated.Value(0)).current;
  const slideBottom = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeTop, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideTop, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeMid, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideMid, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeBottom, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideBottom, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Background glows */}
      <GlowOrb style={styles.orbTop} />
      <GlowOrb style={styles.orbBottom} />

      <View style={styles.container}>

        {/* ── TOP: Branding ─────────────────────────────────────────────── */}
        <Animated.View
          style={[styles.topSection, { opacity: fadeTop, transform: [{ translateY: slideTop }] }]}
        >
          {/* Icon badge */}
          <View style={styles.iconBadge}>
            <Text style={styles.iconBadgeText}>📖</Text>
          </View>

          <Text style={styles.appName}>EduVault</Text>
          <Text style={styles.tagline}>
            Your campus notes,{"\n"}organized and always within reach.
          </Text>
        </Animated.View>

        {/* ── MID: Feature pills ────────────────────────────────────────── */}
        <Animated.View
          style={[styles.midSection, { opacity: fadeMid, transform: [{ translateY: slideMid }] }]}
        >
          <View style={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featurePill}>
                <Text style={styles.featurePillIcon}>{f.icon}</Text>
                <Text style={styles.featurePillLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Built for students</Text>
            <View style={styles.dividerLine} />
          </View>
        </Animated.View>

        {/* ── BOTTOM: CTAs ──────────────────────────────────────────────── */}
        <Animated.View
          style={[styles.bottomSection, { opacity: fadeBottom, transform: [{ translateY: slideBottom }] }]}
        >
          <Pressable
            onPress={() => router.push("/login")}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            accessibilityLabel="Login to EduVault"
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Login</Text>
            <Text style={styles.primaryBtnArrow}>→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/register")}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            accessibilityLabel="Create a new EduVault account"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </Pressable>

          <Text style={styles.footerNote}>
            Free for all students · No ads · No BS
          </Text>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 48,
    paddingBottom: 40,
  },

  // Background orbs
  orbTop: {
    position: "absolute",
    top: -80,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: C.accentGlow,
  },
  orbBottom: {
    position: "absolute",
    bottom: -60,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#3B0764AA",
  },

  // TOP SECTION
  topSection: {
    alignItems: "flex-start",
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: C.accentGlow,
    borderWidth: 1,
    borderColor: C.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBadgeText: {
    fontSize: 28,
  },
  appName: {
    fontSize: 48,
    fontWeight: "900",
    color: C.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 52,
    marginBottom: 14,
  },
  tagline: {
    fontSize: 16,
    color: C.textSecondary,
    lineHeight: 24,
    fontWeight: "400",
  },

  // MID SECTION
  midSection: {
    gap: 20,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 7,
  },
  featurePillIcon: {
    fontSize: 14,
  },
  featurePillLabel: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // BOTTOM SECTION
  bottomSection: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: C.accent,
    paddingVertical: 17,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  primaryBtnArrow: {
    color: C.accentLight,
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: C.accentMid,
    backgroundColor: C.accentGlow,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  secondaryBtnText: {
    color: C.accentLight,
    fontSize: 15,
    fontWeight: "600",
  },
  footerNote: {
    color: C.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 0.2,
  },
});