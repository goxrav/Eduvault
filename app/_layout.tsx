import { Stack } from "expo-router";
import GlobalSnackbar from "../src/components/GlobalSnackbar";
import { Provider as PaperProvider } from "react-native-paper";
import {UserProvider} from "../src/context/UserContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../src/context/ThemeContext";
export default function Layout() {
  return (
    <ThemeProvider>
    <SafeAreaProvider>
    <UserProvider>
      <PaperProvider>
        <Stack screenOptions={{headerShown: false}}/>
        <GlobalSnackbar />
      </PaperProvider>
    </UserProvider>
    </SafeAreaProvider>
    </ThemeProvider>
  );
}
  