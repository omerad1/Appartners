// components/DatePicker.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const DatePicker = ({ title, date, setDate }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false); // Hide the picker after selection
    if (selectedDate) {
      setDate(dayjs(selectedDate)); // Update the birthDay state
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={styles.dateText}>
          {date ? date.format("YYYY-MM-DD") : "Select a date"}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          placeholderText="Select a date"
          value={date.toDate()} // Convert dayjs object to Date
          mode="date"
          display="default"
          onChange={onChange}
          maximumDate={new Date()} // Disallow future dates
        />
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.83)",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.48)",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },
});
