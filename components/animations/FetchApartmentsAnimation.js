import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';

const FetchApartmentsAnimation = () => {
  // Shared values for animations
  const radarSweepAnimation = useSharedValue(0);
  const radarBeepAnimation = useSharedValue(0);
  const dotAnimation1 = useSharedValue(0);
  const dotAnimation2 = useSharedValue(0);
  const dotAnimation3 = useSharedValue(0);
  const textFadeAnimation = useSharedValue(0);
  
  // House animations
  const house1Animation = useSharedValue(0);
  const house2Animation = useSharedValue(0);
  const house3Animation = useSharedValue(0);
  const house4Animation = useSharedValue(0);
  
  // Fixed house positions at exact angles - these never change
  const getFixedHousePositions = () => {
    const centerX = 110; // Half of radar screen (220px)
    const centerY = 110;
    const positions = [
      // House 1 at 60° - fixed radius of 70px
      {
        left: centerX + 70 * Math.cos((60 * Math.PI) / 180) - 12,
        top: centerY + 70 * Math.sin((60 * Math.PI) / 180) - 12,
        angle: 60
      },
      // House 2 at 135° - fixed radius of 60px
      {
        left: centerX + 60 * Math.cos((135 * Math.PI) / 180) - 12,
        top: centerY + 60 * Math.sin((135 * Math.PI) / 180) - 12,
        angle: 135
      },
      // House 3 at 240° - fixed radius of 80px
      {
        left: centerX + 80 * Math.cos((240 * Math.PI) / 180) - 12,
        top: centerY + 80 * Math.sin((240 * Math.PI) / 180) - 12,
        angle: 240
      },
      // House 4 at 340° - fixed radius of 65px
      {
        left: centerX + 65 * Math.cos((340 * Math.PI) / 180) - 12,
        top: centerY + 65 * Math.sin((340 * Math.PI) / 180) - 12,
        angle: 340
      }
    ];
    
    return positions;
  };

  // Random house positions within radar circles
  const [housePositions, setHousePositions] = useState(getFixedHousePositions());

  useEffect(() => {
    // Start radar sweep from 0
    radarSweepAnimation.value = 0;
    
    // RADAR ROTATION SPEED - Change duration here to adjust rotation speed
    // Higher number = slower rotation (3500ms = 3.5 seconds per rotation)
    const startRadarSweep = () => {
      radarSweepAnimation.value = 0; // Always reset to 0° (12 o'clock position)
      radarSweepAnimation.value = withTiming(360, { 
        duration: 3500, 
        easing: Easing.linear 
      });
    };

    // Start first sweep
    startRadarSweep();

    // Radar beep animation - pulses when sweep passes certain points
    radarBeepAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2950 }) // Adjusted for 3.5-second rotation
      ),
      -1,
      false
    );

    // Text fade animation
    textFadeAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.6, { duration: 3500 })
      ),
      -1,
      false
    );

    // HOUSE FADE SPEED - Change durations here to adjust house fade timing
    // House animations - triggered by radar sweep position
    // House 1 appears when sweep is at ~90 degrees (1000ms into 4000ms cycle)
    const startHouse1 = () => {
      house1Animation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 2000 }),    // Fade IN speed (was 200ms)
        withTiming(1, { duration: 2000 }),   // Stay visible duration (was 1500ms)
        withTiming(0, { duration: 500 })     // Fade OUT speed (was 300ms)
      );
    };

    // House 2 appears when sweep is at ~180 degrees (2000ms into cycle)
    const startHouse2 = () => {
      house2Animation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 2000 }),    // Fade IN speed
        withTiming(1, { duration: 2000 }),   // Stay visible duration
        withTiming(0, { duration: 500 })     // Fade OUT speed
      );
    };

    // House 3 appears when sweep is at ~270 degrees (3000ms into cycle)
    const startHouse3 = () => {
      house3Animation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 2000 }),    // Fade IN speed
        withTiming(1, { duration: 2000 }),   // Stay visible duration
        withTiming(0, { duration: 500 })     // Fade OUT speed
      );
    };

    // House 4 appears when sweep is at ~360 degrees (4000ms into cycle)
    const startHouse4 = () => {
      house4Animation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 2000 }),    // Fade IN speed
        withTiming(1, { duration: 2000 }),   // Stay visible duration
        withTiming(0, { duration: 500 })     // Fade OUT speed
      );
    };

    // Start house detection cycles - precise timing for specific angles
    const startDetectionCycle = () => {
        setTimeout(startHouse1, 2333);   // 240° (2333ms into cycle)
        setTimeout(startHouse2, 3100);  // 340° (3306ms into cycle)
        setTimeout(startHouse3, 583);   // 60° (583ms into 3500ms cycle)
        setTimeout(startHouse4, 1313);  // 135° (1313ms into cycle)

        setTimeout(startRadarSweep, 3500); // Reset radar sweep after 3.5 seconds
    };

    // Start first cycle immediately
    startDetectionCycle();

    // Repeat detection cycle every 3.5 seconds (matching radar rotation)
    const detectionInterval = setInterval(startDetectionCycle, 3500);

    return () => {
      clearInterval(detectionInterval);
    };
  }, []);

  // Animated styles
  const radarSweepStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${radarSweepAnimation.value}deg` }],
    };
  });

  const radarBeepStyle = useAnimatedStyle(() => {
    const scale = interpolate(radarBeepAnimation.value, [0, 1], [1, 1.3]);
    const opacity = interpolate(radarBeepAnimation.value, [0, 1], [0.3, 0.9]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const textFadeStyle = useAnimatedStyle(() => {
    return {
      opacity: textFadeAnimation.value,
    };
  });


  // House animated styles
  const house1Style = useAnimatedStyle(() => {
    const opacity = interpolate(house1Animation.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = interpolate(house1Animation.value, [0, 0.5, 1], [0.7, 1.0, 0.7]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const house2Style = useAnimatedStyle(() => {
    const opacity = interpolate(house2Animation.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = interpolate(house2Animation.value, [0, 0.5, 1], [0.7, 1.0, 0.7]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const house3Style = useAnimatedStyle(() => {
    const opacity = interpolate(house3Animation.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = interpolate(house3Animation.value, [0, 0.5, 1], [0.7, 1.0, 0.7]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const house4Style = useAnimatedStyle(() => {
    const opacity = interpolate(house4Animation.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = interpolate(house4Animation.value, [0, 0.5, 1], [0.7, 1.0, 0.7]);
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Simple house component
  const SimpleHouse = ({ style, position }) => (
    <Animated.View style={[styles.floatingHouse, position, style]}>
      <View style={styles.houseContainer}>
        {/* House base */}
        <View style={styles.houseBase} />
        {/* House roof */}
        <View style={styles.houseRoof} />
        {/* House door */}
        <View style={styles.houseDoor} />
        {/* House window */}
        <View style={styles.houseWindow} />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 248, 220, 0.95)', 'rgba(255, 240, 200, 0.9)']}
        style={styles.background}
      >
        {/* Main animated container */}
        <View style={styles.animationContainer}>
          
          {/* Radar Screen Background */}
          <View style={styles.radarScreen}>
            {/* Outer tick marks */}
            <View style={styles.radarTicks}>
              {Array.from({ length: 24 }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.radarTick,
                    {
                      transform: [
                        { rotate: `${i * 15}deg` },
                        { translateY: -105 },
                      ],
                    },
                  ]}
                />
              ))}
            </View>

            {/* Concentric circles */}
            <View style={[styles.radarCircle, styles.outerCircle]} />
            <View style={[styles.radarCircle, styles.middleCircle]} />
            <View style={[styles.radarCircle, styles.innerCircle]} />
            <View style={[styles.radarCircle, styles.centerCircle]} />

            {/* Crosshairs */}
            <View style={[styles.radarLine, styles.horizontalLine]} />
            <View style={[styles.radarLine, styles.verticalLine]} />

            {/* Radar Sweep with gradient trail */}
            <Animated.View style={[styles.radarSweepContainer, radarSweepStyle]}>
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(212, 175, 55, 0.1)',
                  'rgba(212, 175, 55, 0.3)',
                  'rgba(212, 175, 55, 0.6)',
                  'rgba(212, 175, 55, 0.9)',
                  '#D4AF37'
                ]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.radarSweepGradient}
              />
            </Animated.View>

            {/* Radar Beep Effect */}
            <Animated.View style={[styles.radarBeep, radarBeepStyle]} />

            {/* Center Dot */}
            <View style={styles.radarCenter} />
          </View>

          {/* Floating houses */}
          {housePositions.map((position, index) => (
            <SimpleHouse key={index} style={index === 0 ? house1Style : index === 1 ? house2Style : index === 2 ? house3Style : house4Style} position={{ left: position.left, top: position.top }} />
          ))}
        </View>

        {/* Enhanced text content */}
        <View style={styles.textContainer}>
          <Animated.View style={textFadeStyle}>
            <Text style={styles.mainText}>Scanning for apartments</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  animationContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  radarScreen: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarTicks: {
    position: 'absolute',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarTick: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#D4AF37',
  },
  radarCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  middleCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  centerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  radarLine: {
    position: 'absolute',
    backgroundColor: '#D4AF37',
  },
  horizontalLine: {
    width: 220,
    height: 2,
  },
  verticalLine: {
    width: 2,
    height: 220,
  },
  radarSweepContainer: {
    position: 'absolute',
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarSweepGradient: {
    position: 'absolute',
    width: 110,
    height: 6,
    transformOrigin: '0% 50%',
    left: 0,
  },
  radarBeep: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B35',
  },
  radarCenter: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8B4513',
  },
  floatingHouse: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  houseBase: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    width: 16,
    height: 12,
    borderWidth: 1.5,
    borderColor: '#8B4513',
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  houseRoof: {
    position: 'absolute',
    top: 0,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B4513',
  },
  houseDoor: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    width: 4,
    height: 6,
    backgroundColor: '#8B4513',
  },
  houseWindow: {
    position: 'absolute',
    bottom: 6,
    left: 14,
    width: 3,
    height: 3,
    borderWidth: 1,
    borderColor: '#8B4513',
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  dot: {
    fontSize: 22,
    color: '#D4AF37',
    marginHorizontal: 6,
  },
  subText: {
    fontSize: 16,
    color: '#A0522D',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  bottomElements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    position: 'absolute',
    bottom: 100,
  },
  smallIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  smallIconDelayed: {
    marginTop: 20,
  },
  smallIconDelayed2: {
    marginTop: 10,
  },
  smallIconText: {
    fontSize: 20,
  },
});

export default FetchApartmentsAnimation;
