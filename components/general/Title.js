import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Title = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{children}</Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "comfortaaRegular",
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
    fontFamily: "comfortaaBold",
  },
});
