import { Drawer } from "expo-router/drawer";
import { View, Text } from "react-native";
import { useUser } from "../../src/context/UserContext";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Image } from "react-native";
import { useRouter } from "expo-router";

function CustomDrawerContent(props) {
  const { user } = useUser();
const router = useRouter();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: "#0F0F1A", flex: 1 }}
    >
      {/* 🔥 PROFILE SECTION */}
      <View
  style={{
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
    marginBottom: 10,
    alignItems: "center",
  }}
>
  <Image
    source={{
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}&background=7C3AED&color=fff`,
    }}
    style={{
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: "#A78BFA",
    }}
  />
  

  <Text style={{ color: "#A78BFA", fontSize: 18, fontWeight: "bold" }}>
    {user?.name || "User"}
  </Text>

  <Text style={{ color: "#A1A1AA", fontSize: 12 }}>
    {user?.email}
  </Text>

  <Text style={{ color: "#71717A", marginTop: 4 }}>
    {user?.branch} • Sem {user?.semester}
  </Text>
</View>

      <DrawerItemList {...props} />
       
    </DrawerContentScrollView>
)}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#0F0F1A" },
        headerTintColor: "#A78BFA",

        drawerStyle: { backgroundColor: "#0F0F1A" },

        drawerActiveTintColor: "#A78BFA",
        drawerInactiveTintColor: "#A1A1AA",
      }}
    >
      {/* ✅ SCREENS BELONG HERE */}
      <Drawer.Screen name="home" options={{ title: "Home" }} />
      <Drawer.Screen name="upload" options={{ title: "Upload Notes" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
      <Drawer.Screen name="Bookmarks" options={{ title: "Bookmarked Notes" }} />
    </Drawer>
  );
}