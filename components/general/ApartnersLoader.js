// components/AppartnersLoader.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Image } from "react-native";

const AppartnersLoader = () => {
  const letters = "Appartners".split("");
  const animations = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const waveAnimation = () => {
      const animationsArray = animations.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 50), // Faster wave delay
          Animated.timing(anim, {
            toValue: 1,
            duration: 250, // Faster up movement
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 250, // Faster down movement
            useNativeDriver: false,
          }),
        ]);
      });

      // Loop the wave animation
      Animated.loop(Animated.stagger(80, animationsArray)).start();
    };

    waveAnimation();
  }, [animations]);

  return (
    <View style={styles.container}>
      {/* Logo above the text */}
      <Image 
        source={require('../../assets/icons/logo-no-title.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      
      {/* Animated text */}
      <View style={styles.textContainer}>
        {letters.map((letter, index) => {
          // Link color and position to the same animation
          const animation = animations[index];
          
          const colorInterpolation = animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["#000000", "#d4af37"], // Black to Gold
          });

          const translateYInterpolation = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20], // Control bounce height
          });

          return (
            <Animated.Text
              key={index}
              style={[
                styles.letter,
                {
                  transform: [{ translateY: translateYInterpolation }],
                  color: colorInterpolation,
                },
              ]}
            >
              {letter}
            </Animated.Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    paddingHorizontal: 10,
  },
  letter: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "comfortaaSemiBold",
  },
});

export default AppartnersLoader;
