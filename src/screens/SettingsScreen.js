import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View, Switch } from "react-native";
import { auth } from "../config/firebaseConfig";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import { useSnackbar } from "../components/GlobalSnackbar";
import { useTheme } from "../context/ThemeContext";
const SettingsScreen = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
const getToast = useSnackbar();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [semester, setSemester] = useState(user?.semester?.toString() || "");

  // 🔥 LOGOUT
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

  // 🔥 SAVE PROFILE
  const handleSave = async () => {
  try {
    console.log("UPDATING USER:", user.uid);

    const res = await api.put(`/api/users/${user.uid}`, {
      name,
      branch,
      semester: Number(semester),
    });

    console.log("UPDATED USER:", res.data);

    setUser(res.data);
    setEditMode(false);

    getToast?.("Profile updated successfully", "success");

  } catch (err) {
    console.log("UPDATE ERROR:", err.response?.data || err.message);
    getToast?.("Error", "Update failed");
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", padding: 20 }}>

      {/* HEADER */}
      <Text style={{ fontSize: 28, color: "#A78BFA", fontWeight: "bold", marginBottom: 20 }}>
        Settings
      </Text>

      {/* 🔥 PROFILE CARD */}
      <View style={{
        backgroundColor: "#1C1C2E",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        alignItems: "center"
      }}>

        {/* AVATAR */}
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=7C3AED&color=fff`,
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: "#A78BFA"
          }}
        />

        {/* EDIT MODE */}
        {editMode ? (
          <>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#777"
              style={styles.input}
            />

            <TextInput
              value={branch}
              onChangeText={setBranch}
              placeholder="Branch"
              placeholderTextColor="#777"
              style={styles.input}
            />

            <TextInput
              value={semester}
              onChangeText={setSemester}
              placeholder="Semester"
              placeholderTextColor="#777"
              keyboardType="numeric"
              style={styles.input}
            />

            {/* SAVE BUTTON */}
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveBtn}
            >
              <Text style={styles.btnText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.value}>{user?.name}</Text>
            <Text style={styles.label}>{user?.email}</Text>
            <Text style={styles.label}>
              {user?.branch} • Sem {user?.semester}
            </Text>
          </>
        )}

      </View>

      {/* EDIT BUTTON */}
      <TouchableOpacity
        onPress={() => setEditMode(!editMode)}
        style={styles.editBtn}
      >
        <Text style={styles.btnText}>
          {editMode ? "Cancel" : "Edit Profile"}
        </Text>
      </TouchableOpacity>

      

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutBtn}
      >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = {
  label: {
    color: "#A1A1AA",
    fontSize: 12,
    marginTop: 6,
  },
  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1C1C2E",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  editBtn: {
    backgroundColor: "#7C3AED",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: "#22C55E",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
};

export default SettingsScreen;