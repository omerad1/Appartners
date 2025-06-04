import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { saveUserPreferences } from "../store/redux/userThunks";
import FilterScreen from "./FilterScreen";
import BackgroundImage from "../components/layouts/BackgroundImage";

const FilterScreenPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  // Get user preferences from Redux store
  const userPreferences = useSelector((state) => state.user.preferences);

  // Get params from navigation if available
  const initialPreferencesFromParams = route.params?.initialPreferences;
  const onApplyFromParams = route.params?.onApply;

  // Use preferences from params if provided, otherwise use Redux preferences
  const initialPreferences =
    initialPreferencesFromParams || userPreferences || {};

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigation.goBack();
    }, 300); // Small delay for animation
  };

  const handleApply = async (preferences) => {
    try {
      // Save preferences to Redux and backend
      await dispatch(saveUserPreferences(preferences));

      // Call the onApply function from params if provided
      if (onApplyFromParams) {
        onApplyFromParams(preferences);
      }

      // Navigate back
      handleClose();
    } catch (error) {
      console.error("Error saving preferences:", error);
      // Still navigate back even if there's an error
      handleClose();
    }
  };

  return (
    <BackgroundImage>
      <SafeAreaView style={styles.container}>
        <FilterScreen
          visible={isVisible}
          onClose={handleClose}
          onApply={handleApply}
          initialPreferences={initialPreferences}
        />
      </SafeAreaView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FilterScreenPage;
