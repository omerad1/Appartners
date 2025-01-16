import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";

const MatchAnimation = () => {
  const scaleLeft = useSharedValue(0);
  const scaleRight = useSharedValue(0);
  const shakeMiddle = useSharedValue(0);

  // Left avatar animation
  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleLeft.value }],
  }));

  // Right avatar animation
  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleRight.value }],
  }));

  // Handshake animation
  const middleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: shakeMiddle.value * 5 },
      { rotate: `${shakeMiddle.value * 10}deg` },
    ],
  }));

  React.useEffect(() => {
    // Start animations
    scaleLeft.value = withTiming(1, { duration: 500 });
    scaleRight.value = withTiming(1, { duration: 500 });
    shakeMiddle.value = withTiming(1, { duration: 500, easing: Easing.bounce });
  }, [scaleLeft, scaleRight, shakeMiddle]);

  return (
    <View style={styles.container}>
      {/* Left side - Single Avatar */}
      <Animated.View style={[styles.avatarContainer, leftStyle]}>
        <Image source={require("../assets/icon.png")} style={styles.avatar} />
      </Animated.View>

      {/* Middle - Handshake Icon */}
      <Animated.View style={[styles.handshakeContainer, middleStyle]}>
        <LottieView
          source={require("../assets/icons/handshakeNoBg.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </Animated.View>

      {/* Right side - Two Avatars */}
      <Animated.View style={[styles.avatarContainer, rightStyle]}>
        <Image source={require("../assets/icon.png")} style={styles.avatar} />
        <Image
          source={require("../assets/icon.png")}
          style={[styles.avatar, styles.overlap]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 200,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#000",
  },
  overlap: {
    position: "absolute",
    left: 40, // Adjust for correct overlap
  },
  handshakeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default MatchAnimation;
