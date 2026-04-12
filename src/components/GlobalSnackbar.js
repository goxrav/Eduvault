import { Snackbar } from "react-native-paper";
import { useState } from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
let showSnackbar;

export const useSnackbar = () => showSnackbar;

export default function GlobalSnackbar() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  showSnackbar = (msg, variant = "info") => {
    setMessage(msg);
    setType(variant);
    setVisible(true);
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "#052E16",
          border: "#22C55E",
          icon: "check-circle",
          color: "#22C55E",
        };
      case "error":
        return {
          bg: "#2D0707",
          border: "#EF4444",
          icon: "error",
          color: "#EF4444",
        };
      case "warning":
        return {
          bg: "#2A1E05",
          border: "#FACC15",
          icon: "warning",
          color: "#FACC15",
        };
      default:
        return {
          bg: "#1C1C2E",
          border: "#7C3AED",
          icon: "info",
          color: "#A78BFA",
        };
    }
  };

  const styles = getStyles();

  return (
    <Snackbar
      visible={visible}
      onDismiss={() => setVisible(false)}
      duration={2500}
      style={{
        backgroundColor: styles.bg,
        borderWidth: 1,
        borderColor: styles.border,
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
       <View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialIcons
      name={styles.icon}
      size={18}
      color={styles.color}
      style={{ marginRight: 6 }}
    />
    
    <Text style={{ color: "#fff", flexShrink: 1 }}>
      {message}
    </Text>
  </View>
</Snackbar>
  );
}