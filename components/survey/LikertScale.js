import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const LikertScale = ({ title1, title5, onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handlePress = (index) => {
    setSelected(index);
    if (onSelect) {
      onSelect(index + 1);
      console.log(index + 1);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Radio Buttons */}
        <View style={styles.radioContainer}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.radioWrapper}>
              <TouchableOpacity
                style={[
                  styles.circle,
                  selected === index && styles.selectedCircle,
                ]}
                onPress={() => handlePress(index)}
              />
              {/* Display labels for the first and last options */}
              {index === 0 && <Text style={styles.label}>{title1}</Text>}
              {index === 4 && <Text style={styles.label}>{title5}</Text>}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default LikertScale;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgb(0, 0, 0)",
    padding: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  radioWrapper: {
    alignItems: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedCircle: {
    borderColor: "rgb(75, 67, 0)",
    backgroundColor: "rgba(75, 67, 0, 0.25)",
  },
  label: {
    fontSize: 14,
    color: "#333",
    borderRadius: 36,
    borderWidth: 1,
    padding: 4,
    borderColor: "rgba(222, 188, 18, 0.21)",
    marginTop: 4,
  },
});
