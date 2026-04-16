import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useUser } from "../src/context/UserContext";
import { useRouter } from "expo-router";

export default function SelectDetails() {
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");

  const { setSelectedBranch, setSelectedSemester } = useUser();
  const router = useRouter();

  const handleSave = () => {
    if (!branch || !semester) {
      console.log("Missing fields");
      return;
    }

    console.log("SELECTED:", branch, semester);

   
    setSelectedBranch(branch);
    setSelectedSemester(semester);

    router.replace("/home");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F0F1A",
        padding: 20,
        justifyContent: "center",
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          color: "#A78BFA",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Choose Your Filter 
      </Text>

      <Text style={{ color: "#A1A1AA", marginBottom: 30 }}>
        Select branch and semester to explore notes
      </Text>

      {/* BRANCH */}
      <Text style={{ color: "white", marginBottom: 5 }}>Branch</Text>
      <View
        style={{
          backgroundColor: "#1C1C2E",
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <Picker
          selectedValue={branch}
          onValueChange={setBranch}
          style={{ color: "white" }}
        >
          <Picker.Item label="Select Branch" value="" />
          <Picker.Item label="CSE" value="CSE" />
          <Picker.Item label="ECE" value="ECE" />
          <Picker.Item label="ME" value="ME" />
          <Picker.Item label="CE" value="CE" />
        </Picker>
      </View>

      {/* SEM */}
      <Text style={{ color: "white", marginBottom: 5 }}>Semester</Text>
      <View
        style={{
          backgroundColor: "#1C1C2E",
          borderRadius: 12,
          marginBottom: 30,
        }}
      >
        <Picker
          selectedValue={semester}
          onValueChange={setSemester}
          style={{ color: "white" }}
        >
          <Picker.Item label="Select Semester" value="" />
          {[1,2,3,4,5,6,7,8].map((s) => (
            <Picker.Item key={s} label={`Sem ${s}`} value={s} />
          ))}
        </Picker>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#7C3AED",
          padding: 16,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Continue →
        </Text>
      </TouchableOpacity>
    </View>
  );
}