import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../api/axios";
import { useSnackbar } from "../components/GlobalSnackbar";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";


const UploadScreen = () => {
  const [branch, setBranch] = useState("");
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("5");
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();
  const getToast = useSnackbar();




  // 🔥 PICK FILE
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  // 🔥 UPLOAD FILE
  const uploadFile = async () => {
    if (!file) {
      getToast("Select a file first 📂","warning");
      return;
    }

    if (!subject || !branch || !semester) {
      getToast("Fill all fields","warning");
      return;
    }

  

    try {
      setUploading(true);

      const fileName = Date.now() + "_" + file.name;

      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error } = await supabase.storage
        .from("notes")
        .upload(fileName, arrayBuffer, {
          contentType: file.mimeType || "application/octet-stream",
        });

     if (error) {
  getToast("Upload failed ❌", "error");
  return;
}

      const { data } = supabase.storage
        .from("notes")
        .getPublicUrl(fileName);

      console.log("UPLOAD USER:", user);
if (!user || !user.uid) {
  getToast?.("User not loaded. Please login again", "error");
  return;
}
      await api.post("/api/notes", {
        title: file.name || "Untitled Note",
        subject,
        branch,
        semester: Number(semester),
        fileUrl: data.publicUrl,
        uploadedBy: user?.uid,
        userEmail: user?.email,
        userName: user?.name,
      });

       // reset
      setSubject("");
      setBranch("");
      setSemester("");
      setFile(null); 

      getToast("Note uploaded successfully 🎉", "success");
      setTimeout(() => {
router.replace("/home");
      }, 300);
      
    } 
   catch (err) {
  console.log("FULL ERROR:", err);

  const message =
    err.response?.data?.message ||
    err.message ||
    "Something went wrong";

  if (message === "Note already exists") {
    getToast?.("You already uploaded this note", "warning");
  } else {
    getToast?.(message, "error");
  }
}
     finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0F0F1A", padding: 20 }}>

      {/* 🔥 HEADER */}
      <Text style={{ fontSize: 26, color: "#A78BFA", fontWeight: "bold" }}>
        Add Notes
      </Text>
      <Text style={{ color: "#A1A1AA", marginBottom: 20 }}>
        Upload your study material
      </Text>





      {/* 🔥 FILE PICKER */}
      <TouchableOpacity
        onPress={pickFile}
        style={{
          backgroundColor: "#1C1C2E",
          padding: 20,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#2A2A40",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#A1A1AA" }}>
          Tap to select file 📂
        </Text>
      </TouchableOpacity>

      {/* 🔥 FILE PREVIEW */}
      {file && (
        <View
          style={{
            backgroundColor: "#1C1C2E",
            padding: 15,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#A78BFA", fontWeight: "bold" }}>
            📄 {file.name}
          </Text>
          <Text style={{ color: "#71717A", fontSize: 12 }}>
            Ready to upload
          </Text>
        </View>
      )}

      <Picker
        selectedValue={branch}
        onValueChange={(value) => setBranch(value)}
        style={{
          backgroundColor: "#1C1C2E",
          color: "white",
          marginBottom: 15,
        }}
      >
        <Picker.Item label="Select Branch" value="" />
        <Picker.Item label="CSE" value="CSE" />
        <Picker.Item label="ECE" value="ECE" />
        <Picker.Item label="ME" value="ME" />
      </Picker>

      <Picker
        selectedValue={semester}
        onValueChange={(value) => setSemester(value)}
        style={{
          backgroundColor: "#1C1C2E",
          color: "white",
          marginBottom: 15,
        }}
      >
        <Picker.Item label="Select Semester" value="" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <Picker.Item key={sem} label={`Sem ${sem}`} value={sem} />
        ))}
      </Picker>
      <Text style={{ color: "white", marginBottom: 5 }}>
        Subject
      </Text>

      <TextInput
        placeholder="Enter subject (e.g. DBMS, OS, DSA)"
        placeholderTextColor="#777"
        value={subject}
        onChangeText={setSubject}
        style={{
          backgroundColor: "#1C1C2E",
          color: "white",
          padding: 12,
          borderRadius: 12,
          marginBottom: 15,
        }}
      />


      {/* 🔥 UPLOAD BUTTON */}
      <TouchableOpacity
        onPress={uploadFile}
        disabled={!file || !subject || !branch || !semester || uploading}
        style={{
          backgroundColor:
            !file || !subject || !branch || !semester
              ? "#444"
              : "#7C3AED",
          padding: 15,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {uploading ? "Uploading..." : "Upload Notes"}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default UploadScreen;