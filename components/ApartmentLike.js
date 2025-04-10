import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, I18nManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width minus padding

const ApartmentLike = ({ apartment, onPress }) => {
  // Extract up to 2 random tags if they exist
  const displayTags = apartment.tags && apartment.tags.length > 0 
    ? apartment.tags.slice(0, 2) 
    : [];

  // Format address for Hebrew display
  const formatAddress = (address) => {
    if (!address) return 'כתובת לא זמינה'; // "Address not available" in Hebrew
    return address;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress && onPress(apartment)}
      activeOpacity={0.9}
    >
      <Image 
        source={
          apartment.image_url 
            ? { uri: apartment.image_url } 
            : require('../assets/icons/avi-avatar.jpg')
        } 
        style={styles.image}
      />
      
      {/* Gradient overlay for better text visibility */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.address} numberOfLines={1}>
            {formatAddress(apartment.address)}
          </Text>
          
          <View style={styles.tagsContainer}>
            {displayTags.map((tag, index) => (
              <View key={index} style={styles.tagContainer}>
                <Text style={styles.tag}>{tag}</Text>
              </View>
            ))}
          </View>
          
          {apartment.price_per_month && (
            <Text style={styles.price}>
              {apartment.price_per_month} ₪/לחודש
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 300,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    padding: 16,
    alignItems: 'flex-end', // Align content to the right
  },
  address: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'right', // Right-align text
    writingDirection: 'rtl', // RTL text direction
  },
  tagsContainer: {
    flexDirection: 'row-reverse', // Reverse direction for RTL
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  tagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8, // Changed from marginRight to marginLeft for RTL
    marginRight: 0,
  },
  tag: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  price: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right', // Right-align text
    writingDirection: 'rtl', // RTL text direction
  },
});

export default ApartmentLike;
