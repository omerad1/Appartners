import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import InputField from "../../components/onBoarding/InputField";
import SimpleDropDown from "../../components/SimpleDropDown";
import DatePicker from "../../components/DatePicker";
import dayjs from "dayjs";
import ProfileImagePicker from "../../components/onBoarding/ProfileImagePicker";
import { ScrollView } from "react-native-gesture-handler";
const StepFour = () => {
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState(null);
  const [birthDay, setBirthDay] = useState(dayjs());
  const [profileImage, setProfileImage] = useState(null);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  return (
    <ScrollView style={styles.container}>
      <OnBoardingLayout
        direction="StepFive"
        next={true}
        title={`Let's Start With The Basics`}
      >
        <ProfileImagePicker
          profileImage={profileImage}
          setProfileImage={setProfileImage}
        />
        <SimpleDropDown
          data={genderOptions}
          onChange={setGender}
          placeholder="Gender"
        />
        <InputField
          placeholder="Occupation"
          type="text"
          onChange={(occupation) => setOccupation(occupation)}
        />
        <DatePicker
          title={"Select Birth Date"}
          date={birthDay}
          setDate={setBirthDay}
        />
      </OnBoardingLayout>
    </ScrollView>
  );
};

export default StepFour;

const styles = StyleSheet.create({});
