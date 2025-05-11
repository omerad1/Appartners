import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const PriceRangePicker = ({
  minPrice = 0,
  maxPrice = 10000,
  step = 100,
  onChange,
  initialRange = null,
}) => {
  const [priceRange, setPriceRange] = useState(
    initialRange || {
      min: minPrice,
      max: maxPrice,
    }
  );
  
  // Update priceRange if initialRange changes
  useEffect(() => {
    if (initialRange) {
      setPriceRange(initialRange);
    }
  }, [initialRange]);

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
      <View style={styles.priceDisplay}>
        <Text style={styles.priceText}>
          ₪{Math.round(priceRange.min).toLocaleString()} - ₪
          {Math.round(priceRange.max).toLocaleString()}
        </Text>
      </View>
      <View style={styles.slidersContainer}>
        {/* Min Price Slider */}
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Min Price</Text>
          <Text style={styles.sliderValue}>₪{Math.round(priceRange.min).toLocaleString()}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={minPrice}
          maximumValue={maxPrice}
          value={priceRange.min}
          onValueChange={handleMinChange}
          minimumTrackTintColor="#333"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#000"
          step={step}
          tapToSeek={true}
        />

        {/* Max Price Slider */}
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Max Price</Text>
          <Text style={styles.sliderValue}>₪{Math.round(priceRange.max).toLocaleString()}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={minPrice}
          maximumValue={maxPrice}
          value={priceRange.max}
          onValueChange={handleMaxChange}
          minimumTrackTintColor="#333"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#000"
          step={step}
          tapToSeek={true}
        />
      </View>
    </View>
  );
};

export default PriceRangePicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 15,
  },
  slidersContainer: {
    marginTop: 15,
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  priceText: {
    fontSize: 18,
    fontFamily: "comfortaaSemiBold",
    color: "#000",
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 15,
  },
  sliderLabel: {
    fontSize: 14,
    fontFamily: "comfortaaRegular",
    color: "#333",
  },
  sliderValue: {
    fontSize: 14,
    fontFamily: "comfortaaSemiBold",
    color: "#000",
  },
});
