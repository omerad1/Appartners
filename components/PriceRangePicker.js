import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const PriceRangePicker = ({
  minPrice = 0,
  maxPrice = 10000,
  step = 100,
  onChange,
}) => {
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice,
  });

  const handleMinChange = (value) => {
    const updatedRange = {
      ...priceRange,
      min: Math.min(value, priceRange.max),
    };
    setPriceRange(updatedRange);
    onChange(updatedRange);
  };

  const handleMaxChange = (value) => {
    const updatedRange = {
      ...priceRange,
      max: Math.max(value, priceRange.min),
    };
    setPriceRange(updatedRange);
    onChange(updatedRange);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price Range</Text>
      <View style={styles.priceDisplay}>
        <Text style={styles.priceText}>
          ₪{priceRange.min.toLocaleString()} - ₪
          {priceRange.max.toLocaleString()}
        </Text>
      </View>
      <View>
        {/* Min Price Slider */}
        <Text style={styles.sliderLabel}>Min Price</Text>
        <Slider
          style={styles.slider}
          minimumValue={minPrice}
          maximumValue={maxPrice}
          value={priceRange.min}
          onValueChange={handleMinChange}
          minimumTrackTintColor="#506ef2"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#506ef2"
          step={step}
        />

        {/* Max Price Slider */}
        <Text style={styles.sliderLabel}>Max Price</Text>
        <Slider
          style={styles.slider}
          minimumValue={minPrice}
          maximumValue={maxPrice}
          value={priceRange.max}
          onValueChange={handleMaxChange}
          minimumTrackTintColor="#506ef2"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#506ef2"
          step={step}
        />
      </View>
    </View>
  );
};

export default PriceRangePicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.83)",
    borderRadius: 10,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 7,
  },
  label: {
    fontSize: 18,
    fontFamily: "comfortaaSemiBold",
    color: "rgba(0, 0, 0, 0.7)",
    textAlign: "center",
    marginBottom: 10,
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  priceText: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
    color: "rgba(0, 0, 0, 0.8)",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabel: {
    fontSize: 14,
    fontFamily: "comfortaaRegular",
    color: "rgba(0, 0, 0, 0.7)",
    marginTop: 10,
  },
});
