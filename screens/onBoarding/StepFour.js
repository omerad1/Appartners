import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import InputField from "../../components/onBoarding/InputField";
import SimpleDropDown from "../../components/general/SimpleDropDown";
import DatePicker from "../../components/general/DatePicker";
import dayjs from "dayjs";
import ProfileImagePicker from "../../components/onBoarding/ProfileImagePicker";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';

const StepFour = () => {
  const dispatch = useDispatch();
  const { occupation, gender, birthDate, profileImage: savedProfileImage } = useSelector(state => state.onboarding);

  const [localOccupation, setLocalOccupation] = useState(occupation || "");
  const [localGender, setLocalGender] = useState(gender || null);
  const [localBirthDay, setLocalBirthDay] = useState(
    birthDate ? dayjs(birthDate) : null
  );  const [localProfileImage, setLocalProfileImage] = useState(savedProfileImage || null);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const handleGenderChange = (value) => {
    setLocalGender(value);
    dispatch(updateOnboardingData({ gender: value }));
  };

  const handleOccupationChange = (value) => {
    setLocalOccupation(value);
    dispatch(updateOnboardingData({ occupation: value }));
  };

  const handleBirthDateChange = (date) => {
    setLocalBirthDay(date);
    dispatch(updateOnboardingData({ birthDate: new Date(date).toISOString() }));
  };

  const handleProfileImageChange = (image) => {
    setLocalProfileImage(image);
    dispatch(updateOnboardingData({ 
      profileImage: image,
      photo: image
    }));
  };

  const handleNext = () => {
    if (!localGender || !localOccupation || !localBirthDay || !localProfileImage) {
      // Show error if required fields are missing
      return false;
    }
    return true;
  };

  return (
    <OnBoardingLayout
      direction="StepFive"
      next={true}
      title={`Let's Start With The Basics`}
      onPress={handleNext}
    >
      <ProfileImagePicker
        profileImage={localProfileImage}
        setProfileImage={handleProfileImageChange}
      />
      <SimpleDropDown
        data={genderOptions}
        onChange={handleGenderChange}
        value={localGender}
        placeholder="Gender"
      />
      <InputField
        placeholder="Occupation"
        type="text"
        value={localOccupation}
        onChange={handleOccupationChange}
      />
      <DatePicker
        placeholder="Select Birth Date"
        value={localBirthDay}
        onChange={handleBirthDateChange}
        mode="birthdate"
      />
    </OnBoardingLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default StepFour;
