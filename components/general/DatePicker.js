// DatePicker.js (enhanced logic)

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const DatePicker = ({ 
  placeholder, 
  onDateConfirm,
  initialDate,
  value,
  onChange,
  error = null,
  style,
  mode = 'birthdate' // 'birthdate' or 'entryDate'
}) => {
  const hasValidDate = value instanceof Date;
  const hasValidInitialDate = initialDate instanceof Date;
  const [date, setDate] = useState(hasValidDate ? value : (hasValidInitialDate ? initialDate : null));
  const [tempDate, setTempDate] = useState(date || new Date());
  const [visible, setVisible] = useState(false);

  // Handle all possible date formats and null values
  useEffect(() => {
    if (value instanceof Date) {
      setDate(value);
      setTempDate(value);
    } else if (value && typeof value === 'object' && value.toDate) {
      // Handle dayjs objects
      const nativeDate = value.toDate();
      setDate(nativeDate);
      setTempDate(nativeDate);
    } else if (value === null || value === undefined || value === "") {
      // Clear the date if value is null/undefined/empty
      setDate(null);
      // Keep tempDate as a valid date for the picker
      setTempDate(new Date());
    }
  }, [value]);
  
  // Also handle initialDate changes
  useEffect(() => {
    if (!value && initialDate) {
      if (initialDate instanceof Date) {
        setDate(initialDate);
        setTempDate(initialDate);
      } else if (initialDate && typeof initialDate === 'object' && initialDate.toDate) {
        // Handle dayjs objects
        const nativeDate = initialDate.toDate();
        setDate(nativeDate);
        setTempDate(nativeDate);
      }
    }
  }, [initialDate, value]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const confirmDate = () => {
    setDate(tempDate);
    
    // Ensure we have a valid date object to pass to callbacks
    if (tempDate instanceof Date && !isNaN(tempDate.getTime())) {
      if (onChange) onChange(tempDate);
      if (onDateConfirm) onDateConfirm(tempDate);
    }
    
    hideModal();
  };

  const getMinimumDate = () => {
    if (mode === 'entryDate') return new Date(); // Entry date must be in future or today
    if (mode === 'birthdate') return new Date(1900, 0, 1); // Oldest allowed birthdate
    return undefined;
  };

  const getMaximumDate = () => {
    if (mode === 'birthdate') {
      const today = new Date();
      today.setFullYear(today.getFullYear() - 18); // Must be at least 18 years old
      return today;
    }
    return undefined; // No max limit for entryDate
  };

  const formattedDate = date instanceof Date 
    ? date.toLocaleDateString('en-GB')
    : '';
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.inputContainer}
        activeOpacity={0.7} 
        onPress={showModal}
      >
        <TextInput
          style={[styles.input, error ? { borderColor: "red" } : null]}
          placeholder={placeholder}
          value={formattedDate}
          editable={false}
          pointerEvents="none"
          placeholderTextColor={"rgba(0, 0, 0, 0.48)"}
        />
        <View style={styles.iconButton}>
          <Icon name="calendar" size={20} color="#888" />
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 }}
        >
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selectedDate) => selectedDate && setTempDate(selectedDate)}
            minimumDate={getMinimumDate()}
            maximumDate={getMaximumDate()}
          />

          <View style={styles.buttonContainer}>
            <Button 
              onPress={hideModal} 
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
              mode="outlined"
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={confirmDate} 
              style={styles.confirmButton}
              buttonColor="black"
            >
              Confirm
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 45,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
  },
  iconButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10
  },
  cancelButton: {
    marginRight: 20,
    borderColor: '#888',
    minWidth: 100
  },
  cancelButtonText: {
    color: '#555'
  },
  confirmButton: {
    minWidth: 100
  }
});

export default DatePicker;
