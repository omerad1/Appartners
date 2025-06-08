import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

/**
 * An enhanced Likert scale component for surveys
 * Displays a 1-5 scale with min/max labels and larger buttons
 */
const LikertScale = ({ title1, title5, onSelect, initialValue = null, disabled = false }) => {
  // Convert initialValue (1-5) to index (0-4) if it exists
  const initialIndex = initialValue !== null ? initialValue - 1 : null;
  const [selected, setSelected] = useState(initialIndex);
  
  // Reset selected state when initialValue changes
  useEffect(() => {
    const newIndex = initialValue !== null ? initialValue - 1 : null;
    setSelected(newIndex);
  }, [initialValue]);
  
  // Function to handle selection and deselection
  const handlePress = (value) => {
    // If the same value is pressed again, deselect it
    if (selected === value) {
      setSelected(null);
      if (onSelect) {
        onSelect(null); // Pass null to indicate no selection
      }
    } else {
      setSelected(value);
      if (onSelect) {
        onSelect(value + 1); // Values from 1-5
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scaleContainer}>
        {/* Buttons with numbers 1-5 */}
        {[0, 1, 2, 3, 4].map((value) => (
          <View key={value} style={styles.buttonColumn}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                selected === value && styles.selectedButton
              ]}
              onPress={() => !disabled && handlePress(value)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              <Text style={[
                styles.buttonText,
                selected === value && styles.selectedButtonText
              ]}>
                {value + 1}
              </Text>
            </TouchableOpacity>
            
            {/* Always show labels under 1 and 5 */}
            {(value === 0 || value === 4) && (
              <View style={styles.labelContainer}>
                <Text style={styles.endLabel}>
                  {value === 0 ? title1 : title5}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  buttonColumn: {
    alignItems: 'center',
    width: 70,
    overflow: 'visible',
  },
  labelContainer: {
    height: 50,
    marginTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'visible',
    width: 100,
  },
  endLabel: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'comfortaaBold',
    textAlign: 'center',
    width: 100,
    overflow: 'visible',
  },
  radioButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  selectedButton: {
    backgroundColor: 'rgba(255, 225, 0, 0.2)',
    borderColor: 'rgb(255, 225, 0)',
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  buttonText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'comfortaaMedium',
  },
  selectedButtonText: {
    color: '#333',
    fontFamily: 'comfortaaSemiBold',
  }
});

export default LikertScale;
