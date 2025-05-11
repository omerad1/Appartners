import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

/**
 * A compact radio scale component specifically for questionnaires
 * Displays a 1-5 scale with min/max labels and smaller buttons
 */
const QuestionScale = ({ minLabel, maxLabel, onSelect, initialValue = null, disabled = false }) => {
  // Convert initialValue (1-5) to index (0-4) if it exists
  const initialIndex = initialValue !== null ? initialValue - 1 : null;
  const [selected, setSelected] = useState(initialIndex);
  
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
                  {value === 0 ? minLabel : maxLabel}
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
    paddingVertical: 10,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  buttonColumn: {
    alignItems: 'center',
    width: 60,
  },
  labelContainer: {
    height: 40,
    marginTop: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  endLabel: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'comfortaaRegular',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  radioButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: 'rgba(255, 225, 0, 0.2)',
    borderColor: 'rgb(255, 225, 0)',
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'comfortaaMedium',
  },
  selectedButtonText: {
    color: '#333',
    fontFamily: 'comfortaaSemiBold',
  }
});

export default QuestionScale;
