import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { auth } from "../config/firebaseConfig";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import { useSnackbar } from "../components/GlobalSnackbar";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

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
  blue: "#3B82F6",
  blueDim: "#0A1929",
  textPrimary: "#F4F4F5",
  textSecondary: "#A1A1AA",
  textMuted: "#52525B",
};

const SettingsScreen = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const getToast = useSnackbar();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [semester, setSemester] = useState(user?.semester?.toString() || "");

  // ── ALL LOGIC UNCHANGED ──
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      getToast?.("Logged out successfully", "success");
      router.replace("/");
    } catch (error) {
      getToast?.("Logout failed", "error");
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/users/${user.uid}`, {
        name,
        branch,
        semester: Number(semester),
      });
      setUser(res.data);
      setEditMode(false);
      getToast?.("Profile updated successfully", "success");
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
      getToast?.("Error", "Update failed");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── BANNER ── */}
        <View style={styles.banner}>
          {/* top purple wash */}
          <View style={styles.bannerBg} />

          {/* Page title inside banner */}
          <Text style={styles.pageTitle}>Settings</Text>

          {/* Avatar — overlaps banner bottom edge */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "User"
                )}&background=7C3AED&color=fff&size=128`,
              }}
              style={styles.avatar}
            />
            {/* Online dot */}
            <View style={styles.onlineDot} />
          </View>
        </View>

        {/* ── USER INFO or EDIT FORM ── */}
        <View style={styles.profileSection}>
          {editMode ? (
            <>
              <Text style={styles.sectionLabel}>Edit Profile</Text>

              <View style={styles.inputGroup}>
                <View style={styles.inputRow}>
                  <MaterialIcons
                    name="person-outline"
                    size={16}
                    color={COLORS.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputRow}>
                  <MaterialIcons
                    name="school"
                    size={16}
                    color={COLORS.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={branch}
                    onChangeText={setBranch}
                    placeholder="Branch"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputRow}>
                  <MaterialIcons
                    name="menu-book"
                    size={16}
                    color={COLORS.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={semester}
                    onChangeText={setSemester}
                    placeholder="Semester"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Save */}
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <MaterialIcons name="check" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>

              {/* Info chips */}
              <View style={styles.chipRow}>
                {user?.branch && (
                  <View style={styles.chip}>
                    <MaterialIcons
                      name="school"
                      size={12}
                      color={COLORS.accentLight}
                    />
                    <Text style={styles.chipText}>{user.branch}</Text>
                  </View>
                )}
                {user?.semester && (
                  <View style={styles.chip}>
                    <MaterialIcons
                      name="menu-book"
                      size={12}
                      color={COLORS.accentLight}
                    />
                    <Text style={styles.chipText}>Sem {user.semester}</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        {/* ── ACTION CARDS ── */}
        <View style={styles.actionSection}>

          {/* Edit / Cancel */}
          <Pressable
            onPress={() => setEditMode(!editMode)}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.actionCardPressed,
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.accentDim }]}>
              <MaterialIcons
                name={editMode ? "close" : "edit"}
                size={18}
                color={COLORS.accentLight}
              />
            </View>
            <Text style={styles.actionText}>
              {editMode ? "Cancel Editing" : "Edit Profile"}
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={18}
              color={COLORS.textMuted}
            />
          </Pressable>

          {/* Change Password */}
          <Pressable
            onPress={() => router.push("/change-password")}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.actionCardPressed,
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.blueDim }]}>
              <MaterialIcons name="lock-outline" size={18} color={COLORS.blue} />
            </View>
            <Text style={styles.actionText}>Change Password</Text>
            <MaterialIcons
              name="chevron-right"
              size={18}
              color={COLORS.textMuted}
            />
          </Pressable>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Logout */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.actionCard,
              styles.actionCardDanger,
              pressed && styles.actionCardPressed,
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.redDim }]}>
              <MaterialIcons name="logout" size={18} color={COLORS.red} />
            </View>
            <Text style={[styles.actionText, { color: COLORS.red }]}>
              Logout
            </Text>
            <MaterialIcons name="chevron-right" size={18} color={COLORS.red} />
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },

  // ── Banner
  banner: {
    height: 160,
    position: "relative",
    alignItems: "center",
  },
  bannerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: COLORS.accentDim,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderColor: COLORS.accent,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.accentLight,
    letterSpacing: -0.3,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 12,
  },
  avatarWrapper: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },

  // ── Profile section
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginBottom: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  chipText: {
    color: COLORS.accentLight,
    fontSize: 12,
    fontWeight: "600",
  },

  // ── Input group
  inputGroup: {
    width: "100%",
    gap: 10,
    marginBottom: 16,
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
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.greenDim,
    borderWidth: 1,
    borderColor: COLORS.green,
    paddingVertical: 13,
    borderRadius: 12,
    width: "100%",
  },
  saveBtnText: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: "700",
  },

  // ── Action cards
  actionSection: {
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionCardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  actionCardDanger: {
    borderColor: "#3D1010",
    backgroundColor: "#0F0808",
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
});

export default SettingsScreen;