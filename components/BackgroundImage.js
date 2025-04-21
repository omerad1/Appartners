import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

const BackgroundImage = ({ children, opacity = 0.3 }) => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/background.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={[styles.overlay, { opacity: opacity }]} />
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 3,
  }
});

export default BackgroundImage;
