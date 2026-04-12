import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useSnackbar } from "../components/GlobalSnackbar";
import { useUser } from "../context/UserContext";
import { useRouter } from "expo-router";
import api from "../api/axios";
import { Ionicons } from "@expo/vector-icons";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const getToast = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
const { signIn, request } = useGoogleAuth();
  const handleLogin = async () => {
    if (!email || !password) {
      getToast?.("Please enter email and password", "warning");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const res = await api.get(`/api/users/${firebaseUser.uid}`);
      setUser(res.data);
      getToast?.("Login successful ✅", "success");
      router.replace("/select-details");
    } catch (error) {
      let message = "Login failed";
      if (error.code === "auth/invalid-email") message = "Invalid email format";
      else if (error.code === "auth/user-not-found") message = "User not found";
      else if (error.code === "auth/wrong-password") message = "Incorrect password";
      else if (error.code === "auth/invalid-credential") message = "Invalid credentials";
      else message = error.message;
      getToast?.(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* TOP ACCENT BAR */}
        <View style={styles.accentBar} />

        {/* LOGO AREA */}
        <View style={styles.logoArea}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>E</Text>
          </View>
          <Text style={styles.appName}>EduVault</Text>
          <Text style={styles.tagline}>Your college notes, organized.</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to continue</Text>

          {/* EMAIL */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[
              styles.inputRow,
              focusedField === "email" && styles.inputRowFocused
            ]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={focusedField === "email" ? "#A78BFA" : "#52525B"}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="you@college.edu"
                placeholderTextColor="#52525B"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={[
              styles.inputRow,
              focusedField === "password" && styles.inputRowFocused
            ]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={focusedField === "password" ? "#A78BFA" : "#52525B"}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#52525B"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#52525B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* GOOGLE SIGN IN — wire up later */}
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.85}
            onPress={signIn}
            disabled={!request}
          >
            <Ionicons name="logo-google" size={18} color="#A78BFA" />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.footerLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0F0F1A",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  accentBar: {
    height: 3,
    width: 48,
    backgroundColor: "#7C3AED",
    borderRadius: 2,
    marginTop: 60,
    marginBottom: 32,
  },
  logoArea: {
    alignItems: "flex-start",
    marginBottom: 32,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#A78BFA",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: "#71717A",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#18182A",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2D2D44",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FAFAFA",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#71717A",
    marginBottom: 24,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#A1A1AA",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F0F1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2D2D44",
    paddingHorizontal: 14,
    height: 50,
  },
  inputRowFocused: {
    borderColor: "#7C3AED",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FAFAFA",
    fontSize: 15,
    height: "100%",
  },
  loginBtn: {
    backgroundColor: "#7C3AED",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginBtnDisabled: {
    backgroundColor: "#4C1D95",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2D2D44",
  },
  dividerText: {
    color: "#52525B",
    fontSize: 13,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2D2D44",
    backgroundColor: "#0F0F1A",
  },
  googleBtnText: {
    color: "#A78BFA",
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    marginTop: 28,
    alignItems: "center",
  },
  footerText: {
    color: "#71717A",
    fontSize: 14,
  },
  footerLink: {
    color: "#A78BFA",
    fontWeight: "600",
  },
});

export default LoginScreen;