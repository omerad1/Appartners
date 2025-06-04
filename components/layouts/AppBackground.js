import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const AppBackground = ({ children, opacity = 0.3 }) => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../assets/background.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Overlay with opacity */}
      <View style={[styles.overlay, { opacity: opacity }]} />
      
      {/* Content */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});

export default AppBackground;
