import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ChatSkeleton = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.chatItem}>
      <LinearGradient
        colors={['rgba(255, 248, 220, 0.95)', 'rgba(255, 240, 200, 0.9)']}
        style={styles.chatItemGradient}
      >
        {/* Avatar Skeleton */}
        <View style={styles.avatarContainer}>
          <Animated.View style={[styles.avatarSkeleton, { opacity: shimmerOpacity }]} />
        </View>

        {/* Chat Content Skeleton */}
        <View style={styles.chatContent}>
          {/* Header with name and time */}
          <View style={styles.chatHeader}>
            <Animated.View style={[styles.nameSkeleton, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.timeSkeleton, { opacity: shimmerOpacity }]} />
          </View>
          
          {/* Last message skeleton */}
          <Animated.View style={[styles.messageSkeleton, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.messageSkeletonShort, { opacity: shimmerOpacity }]} />
        </View>

        {/* Right section with house icon placeholder */}
        <View style={styles.rightSection}>
          <Animated.View style={[styles.iconSkeleton, { opacity: shimmerOpacity }]} />
        </View>
      </LinearGradient>
    </View>
  );
};

const ChatSkeletonList = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <ChatSkeleton key={index} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatItemGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarSkeleton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4AF37',
  },
  chatContent: {
    flex: 1,
    marginRight: 12,
  },
  chatHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameSkeleton: {
    height: 17,
    width: 120,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
  },
  timeSkeleton: {
    height: 13,
    width: 50,
    backgroundColor: '#D4AF37',
    borderRadius: 6,
  },
  messageSkeleton: {
    height: 14,
    width: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 7,
    marginBottom: 4,
  },
  messageSkeletonShort: {
    height: 14,
    width: '70%',
    backgroundColor: '#D4AF37',
    borderRadius: 7,
    alignSelf: 'flex-end',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    position: 'relative',
  },
  iconSkeleton: {
    width: 24,
    height: 24,
    backgroundColor: '#D4AF37',
    borderRadius: 12,
  },
});

export default ChatSkeleton;
export { ChatSkeletonList };
