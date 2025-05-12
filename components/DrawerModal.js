import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from 'react-native-paper'; // Import Portal from react-native-paper

const { height } = Dimensions.get('window');

const DrawerModal = ({ visible, onClose, title, children, onSave, saveButtonTitle}) => {
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);
  const [isModalRendered, setIsModalRendered] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsModalRendered(true);
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 500 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(height, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(setIsModalRendered)(false);
        }
      });
    }
  }, [visible]);

  const triggerClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSaveChanges = () => {
    if (onSave) {
      onSave();
    }
  };

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!isModalRendered) {
    return null;
  }

  // Wrap the entire modal in a Portal component
  return (
    <Portal>
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[styles.backdrop, backdropStyle]}
          onTouchEnd={triggerClose}
        />
        
        {/* Drawer */}
        <Animated.View style={[styles.drawer, drawerStyle]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header with X button and title */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={triggerClose}
              >
                <Ionicons name="close-outline" size={26} color="#333" />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>{title}</Text>
              </View>
              <View style={styles.headerRight} />
            </View>
            
            {/* Divider */}
            <View style={styles.divider} />
            
            {/* Content */}
            <View style={styles.contentContainer}>
              {children}
            </View>
            
            {/* Footer with button */}
            {onSave && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.saveButtonText}>{saveButtonTitle}</Text>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1001, // Ensure backdrop is above navigation
  },
  drawer: {
    backgroundColor: '#fff',
    height: height *0.95, // Use full screen height
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 9999, // Very high elevation to ensure it's above everything
    zIndex: 9999, // Very high z-index to ensure it's above everything
  },
  safeArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',

  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'comfortaaSemiBold',
    color: '#333',
    textAlign: 'center',
  },
  headerRight: {
    width: 40, // For layout balance
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'comfortaaSemiBold',
  },
});

export default DrawerModal;
