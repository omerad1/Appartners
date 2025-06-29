import React from "react";
import { StyleSheet, View, Image } from "react-native";
import StepButton from "../onBoarding/StepButton";
import Title from "../general/Title";

const AddApartmentLayout = ({ title, children, direction, next, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logo}
        />
        <Title>{title}</Title>
      </View>
      <View style={styles.contentContainer}>{children}</View>
      <StepButton direction={direction} next={next} onPress={onPress} />
    </View>
  );
};

export default AddApartmentLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 60,
    marginVertical: 10,
    resizeMode: "contain",
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
});
