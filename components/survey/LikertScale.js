import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const LikertScale = ({ title1, title5, onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handlePress = (index) => {
    setSelected(index);
    if (onSelect) {
      onSelect(index + 1);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.radioContainer}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={styles.radioWrapper}>
            {/* Radio Button */}
            <TouchableOpacity
              style={[
                styles.circle,
                selected === index && styles.selectedCircle,
              ]}
              onPress={() => handlePress(index)}
              activeOpacity={0.8}
            />
            {/* Labels */}
            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.label}>
              {index === 0 ? title1 : index === 4 ? title5 : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LikertScale;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  radioWrapper: {
    flex: 1,
    alignItems: "center",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    transition: "all 0.3s ease",
  },
  selectedCircle: {
    borderColor: "rgb(255, 225, 0)",
    backgroundColor: "rgba(129, 90, 18, 0.2)",
    transform: [{ scale: 1.2 }],
  },
  label: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});
