import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterSection = ({ 
  title, 
  isOpen, 
  onToggle, 
  children, 
  iconName, 
  hasValue = false, // New prop to track if filter has a value
  onClear = null // New prop for clearing the filter value
}) => {
  // Determine if we should show the clear button (X) instead of add button (+)
  const showClearButton = hasValue && isOpen;
  
  // Handle the clear button press
  const handleClearPress = (e) => {
    e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} style={styles.header} activeOpacity={0.7}>
        <View style={styles.titleContainer}>
          {iconName && <Ionicons name={iconName} size={22} color="#222" style={styles.titleIcon} />} 
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {showClearButton ? (
            <TouchableOpacity onPress={handleClearPress} style={styles.clearButton}>
              <Ionicons 
                name="close-circle" 
                size={28} 
                color="#222" 
              />
            </TouchableOpacity>
          ) : (
            <Ionicons 
              name={isOpen ? "remove-circle" : "add-circle"} 
              size={28} 
              color="#222" 
            />
          )}
        </View>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderBottomWidth: 1, 
    borderBottomColor: '#ECECEC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15, // Increased horizontal padding to match image
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  titleIcon: {
    marginRight: 10,
    color: '#555', // Slightly lighter icon color to match image
  },
  titleText: {
    fontSize: 17,
    fontFamily: 'comfortaaSemiBold',
    color: '#555', // Slightly lighter text color to match image
    flexShrink: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#222',
    marginRight: 8,
  },
  clearButton: {
    // No specific styling needed as it's just an icon
  },
  content: {
    paddingHorizontal: 15, // Match header padding
    paddingBottom: 15,
    paddingTop: 5,
    backgroundColor: '#FFFFFF',
  },
});

export default FilterSection;
