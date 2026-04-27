import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useSnackbar } from "../components/GlobalSnackbar";
import api from "../api/axios"; 
import { useUser } from "../context/UserContext";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const getToast = useSnackbar();
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleRegister = async () => {
  if (!name || !email || !password || !degree || !branch || !year || !semester) {
    getToast?.("Please fill all fields", "warning");
    return;
  }

  try {
    setLoading(true);

  
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

  
    await updateProfile(user, {
      displayName: name,
    });

  
    const res = await api.post("/api/users", {
      name,
      email,
      uid: user.uid,
      degree,
      branch,
      year: Number(year),
      semester: Number(semester),
    });
setUser(res.data);
  
    getToast?.("Account created successfully ", "success");

    router.replace("/select-details");

  } catch (err) {
    console.log("REGISTER ERROR:", err);

    let message = "Registration failed";

  
    if (err.code === "auth/email-already-in-use") {
      message = "Email already in use";
    } else if (err.code === "auth/invalid-email") {
      message = "Invalid email format";
    } else if (err.code === "auth/weak-password") {
      message = "Password must be at least 6 characters";
    } else {
      message = err.response?.data?.message || err.message;
    }

    getToast?.(message, "error");

  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", padding: 20, justifyContent: "center" }}>
      
      <Text style={{ fontSize: 32, color: "#A78BFA", fontWeight: "bold" }}>
        Create Account
      </Text>

      <Text style={{ color: "#A1A1AA", marginBottom: 30 }}>
        Join EduVault 🚀
      </Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* DEGREE */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={degree} onValueChange={setDegree} style={styles.picker}>
          <Picker.Item label="Select Degree" value="" />
          <Picker.Item label="BTech" value="BTech" />
        </Picker>
      </View>

      {/* BRANCH */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={branch} onValueChange={setBranch} style={styles.picker}>
          <Picker.Item label="Select Branch" value="" />
          <Picker.Item label="CSE" value="CSE" />
          <Picker.Item label="ECE" value="ECE" />
          <Picker.Item label="ME" value="ME" />
          <Picker.Item label="CE" value="CE" />
          <Picker.Item label="ECM" value="ECM" />
        </Picker>
      </View>

      {/* YEAR */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={year} onValueChange={setYear} style={styles.picker}>
          <Picker.Item label="Select Year" value="" />
          <Picker.Item label="1st Year" value="1" />
          <Picker.Item label="2nd Year" value="2" />
          <Picker.Item label="3rd Year" value="3" />
          <Picker.Item label="4th Year" value="4" />
        </Picker>
      </View>

      {/* SEMESTER */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={semester} onValueChange={setSemester} style={styles.picker}>
          <Picker.Item label="Select Semester" value="" />
          {[1,2,3,4,5,6,7,8].map((sem) => (
            <Picker.Item key={sem} label={`Semester ${sem}`} value={sem.toString()} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#444" : "#7C3AED",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {loading ? "Creating account..." : "Register"}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = {
  input: {
    backgroundColor: "#1C1C2E",
    color: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: "#1C1C2E",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    color: "white",
  },
};

export default RegisterScreen;