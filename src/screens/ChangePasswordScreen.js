import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config/firebaseConfig";
import { updatePassword } from "firebase/auth";
import { useSnackbar } from "../components/GlobalSnackbar";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const COLORS = {
  bg: "#0A0A14",
  surface: "#13131F",
  card: "#1A1A2E",
  border: "#252538",
  accent: "#7C3AED",
  accentLight: "#A78BFA",
  accentDim: "#2D1F5E",
  green: "#22C55E",
  greenDim: "#062E1A",
  red: "#EF4444",
  redDim: "#2A0A0A",
  textPrimary: "#F4F4F5",
  textSecondary: "#A1A1AA",
  textMuted: "#52525B",
};

const ChangePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const getToast = useSnackbar();

  // ── ALL LOGIC UNCHANGED ──
  const handleChangePassword = async () => {
  try {
    if (!auth.currentUser) {
      getToast?.("User not logged in ❌", "error");
      return;
    }

    if (!currentPassword) {
      getToast?.("Enter current password", "error");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      getToast?.("Password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      getToast?.("Passwords do not match", "error");
      return;
    }

    // 🔐 RE-AUTHENTICATE FIRST
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(auth.currentUser, credential);

    // 🔐 THEN UPDATE PASSWORD
    await updatePassword(auth.currentUser, newPassword);

    getToast?.("Password updated successfully 🔐", "success");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (err) {
    console.log(err);

    if (err.code === "auth/wrong-password") {
      getToast?.("Current password is incorrect ❌", "error");
    } else if (err.code === "auth/requires-recent-login") {
      getToast?.("Session expired, login again", "error");
      router.replace("/login");
    } else {
      getToast?.("Failed to update password ❌", "error");
    }
  }
};

  // password strength indicator
  const getStrength = () => {
    if (!newPassword) return null;
    if (newPassword.length < 6) return { label: "Too short", color: COLORS.red, width: "25%" };
    if (newPassword.length < 8) return { label: "Weak", color: "#F97316", width: "50%" };
    if (newPassword.match(/[A-Z]/) && newPassword.match(/[0-9]/))
      return { label: "Strong", color: COLORS.green, width: "100%" };
    return { label: "Medium", color: "#EAB308", width: "75%" };
  };

  const strength = getStrength();
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.container}>

        {/* ── Header ── */}
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <MaterialIcons name="arrow-back" size={20} color={COLORS.accentLight} />
        </Pressable>

        <View style={styles.headerIcon}>
          <MaterialIcons name="lock-outline" size={32} color={COLORS.accentLight} />
        </View>

        <Text style={styles.pageTitle}>Change Password</Text>
        <Text style={styles.pageSubtitle}>
          Pick something strong — no "password123" nonsense
        </Text>

        {/* ── Card ── */}
        <View style={styles.card}>

          {/* Show/Hide toggle */}
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggleRow}
          >
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={14}
              color={COLORS.accentLight}
            />
            <Text style={styles.toggleText}>
              {showPassword ? "Hide passwords" : "Show passwords"}
            </Text>
          </Pressable>
          <Text style={styles.inputLabel}>Current Password</Text>
<View style={styles.inputRow}>
  <MaterialIcons
    name="lock"
    size={16}
    color={COLORS.textMuted}
    style={styles.inputIcon}
  />
  <TextInput
    placeholder="Enter current password"
    placeholderTextColor={COLORS.textMuted}
    secureTextEntry={!showPassword}
    value={currentPassword}
    onChangeText={setCurrentPassword}
    style={styles.input}
  />
</View>

          {/* New Password */}
          <Text style={styles.inputLabel}>New Password</Text>
          <View style={styles.inputRow}>
            <MaterialIcons
              name="lock-outline"
              size={16}
              color={COLORS.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />
          </View>

          {/* Strength bar */}
          {strength && (
            <View style={styles.strengthWrap}>
              <View style={styles.strengthTrack}>
                <View
                  style={[
                    styles.strengthFill,
                    { width: strength.width, backgroundColor: strength.color },
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>
            Confirm Password
          </Text>
          <View
            style={[
              styles.inputRow,
              passwordsMatch && { borderColor: COLORS.green },
              passwordsMismatch && { borderColor: COLORS.red },
            ]}
          >
            <MaterialIcons
              name={
                passwordsMatch
                  ? "check-circle"
                  : passwordsMismatch
                  ? "cancel"
                  : "lock-outline"
              }
              size={16}
              color={
                passwordsMatch
                  ? COLORS.green
                  : passwordsMismatch
                  ? COLORS.red
                  : COLORS.textMuted
              }
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Re-enter new password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
          </View>

          {passwordsMismatch && (
            <Text style={styles.errorText}>Passwords don't match</Text>
          )}

        </View>

        {/* ── Update Button ── */}
        <Pressable
          onPress={handleChangePassword}
          disabled={!newPassword || !confirmPassword}
          style={({ pressed }) => [
            styles.updateBtn,
            (!newPassword || !confirmPassword) && styles.updateBtnDisabled,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
        >
          <MaterialIcons name="check" size={18} color="#fff" />
          <Text style={styles.updateBtnText}>Update Password</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Back
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  // Header
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 28,
    lineHeight: 19,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginBottom: 18,
  },
  toggleText: {
    color: COLORS.accentLight,
    fontSize: 12,
    fontWeight: "600",
  },

  // Input
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10101A",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 13,
  },

  // Strength bar
  strengthWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "600",
    width: 52,
    textAlign: "right",
  },

  // Error
  errorText: {
    color: COLORS.red,
    fontSize: 11,
    marginTop: 6,
    marginLeft: 2,
  },

  // Update button
  updateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 14,
  },
  updateBtnDisabled: {
    opacity: 0.4,
  },
  updateBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default ChangePasswordScreen;