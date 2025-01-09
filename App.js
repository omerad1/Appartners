import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LoginScreen from "./screens/LoginScreen"; // Default export
import StepOne from "./screens/onBoarding/StepOne";
export default function App() {
  return (
    <LinearGradient
      colors={[
        "#FFFFFF", // White
        "#FFFBCC", // Soft yellow
        "#BFA374", // Brown
        "#000000", // Black
      ]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <LoginScreen />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
