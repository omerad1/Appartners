import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Portal } from 'react-native-paper';

const { height } = Dimensions.get('window');

const DrawerModal = ({
  visible,
  onClose,
  title,
  children,
  onSave,
  saveButtonTitle,
  leftAction,
}) => {
  const [isModalRendered, setIsModalRendered] = useState(visible);
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

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
    onClose?.();
  };

  const handleSaveChanges = () => {
    onSave?.();
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isModalRendered) return null;

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
            {/* Header */}
            <View style={styles.header}>
              {leftAction ? (
                leftAction
              ) : (
                <TouchableOpacity style={styles.closeButton} onPress={triggerClose}>
                  <Ionicons name="close-outline" size={26} color="#333" />
                </TouchableOpacity>
              )}
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>{title}</Text>
              </View>
              <View style={styles.headerRight} />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Content */}
            <View style={styles.contentContainer}>{children}</View>

            {/* Footer with Save Button */}
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
    zIndex: 1001,
  },
  drawer: {
    backgroundColor: '#fff',
    height: height * 0.95,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 9999,
    zIndex: 9999,
  },
  safeArea: {
    flex: 1,
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
  closeButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'comfortaaSemiBold',
    color: '#333',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5,
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
