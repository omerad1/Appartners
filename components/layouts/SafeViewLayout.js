import { StyleSheet, View } from "react-native";
import React from "react";

const SafeViewLayout = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default SafeViewLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    bottom: 20,
  },
});
