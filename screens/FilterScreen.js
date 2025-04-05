import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  Platform,
} from "react-native";
import Title from "../components/Title";
import DatePicker from "../components/DatePicker";
import InputField from "../components/onBoarding/InputField";
import PriceRangePicker from "../components/PriceRangePicker";

const FilterScreen = () => {
  const [moveInDate, setMoveInDate] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [roommates, setRoommates] = useState("");

  const handleApplyFilters = () => {
    console.log("Filters applied:", { moveInDate, priceRange, roommates });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Title>Set Your Preferences</Title>

            {/* Date Picker */}
            <DatePicker
              title="Move-in Date"
              date={moveInDate}
              setDate={setMoveInDate}
            />

            {/* Price Range Picker */}
            <PriceRangePicker onChange={setPriceRange} />

            {/* Number of Roommates */}
            <InputField
              placeholder="Number of roommates"
              type="numeric"
              onChange={setRoommates}
              label="Number of Roommates"
            />

            {/* Apply Filters Button */}
            <Button title="Apply Filters" onPress={handleApplyFilters} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 60,
  },
});
