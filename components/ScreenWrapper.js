import React from "react";
import { StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ScreenWrapper({ children }) {
  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0)",
          "rgba(255, 251, 204, 0.35)",
          "rgba(191, 163, 116, 0.35)",
          "rgba(0, 0, 0, 0.35)",
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <SafeAreaView style={styles.innerWrapper}>{children}</SafeAreaView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20, // Add horizontal padding for consistent spacing
    paddingTop: 10, // Additional padding for space from the top
    paddingBottom: 10, // Space at the bottom
  },
  innerWrapper: {
    flex: 1,
    borderRadius: 10, // Optional: If you want to round the content edges
    overflow: "hidden", // Ensures content stays inside rounded corners
    padding: 10, // Additional internal padding
  },
});
