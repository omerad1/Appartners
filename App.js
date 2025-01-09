import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LoginScreen from "./screens/LoginScreen"; // Default export

export default function App() {
  return (
    <LinearGradient
      colors={[
        "rgba(255, 196, 0, 0.53)",
        "rgba(255, 255, 255, 0.27)",
        "rgb(192, 173, 46)",
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
