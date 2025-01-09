import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { israelCities } from "../../data/cities/cities";

const StepThree = () => {
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  const handleSearch = (text) => {
    setCity(text);
    if (text) {
      const filtered = israelCities.filter((item) => {
        return item.toLowerCase().startsWith(text.toLowerCase());
      });
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const handleSelect = (selectedCity) => {
    setCity(selectedCity);
    setFilteredCities([]);
  };

  return (
    <OnBoardingLayout
      direction="StepFour"
      next={true}
      title="In Which Location Would You Like To Start Your Search?"
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={handleSearch}
          placeholderTextColor="rgba(0, 0, 0, 0.48)"
        />
        {filteredCities.length > 0 && (
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
          />
        )}
      </View>
    </OnBoardingLayout>
  );
};

export default StepThree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    boxShadow: "7px 7px 5px 2px rgba(0, 0, 0, 0.1)",
  },
  dropdown: {
    position: "absolute", // Make the dropdown independent of the container
    top: 60, // Adjust this to position below the input field
    left: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    maxHeight: 200,
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1000,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 5,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});
