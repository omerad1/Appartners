import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import React from "react";

const StepEight = () => {

  return (
    <OnBoardingLayout
      direction="Survey"
      next={true}
      title={`Now, You'll answer a few questions to help others get to know you better and to make the matching process more accurate and personalized. Feel free to skip any questions at any time!`}
    ></OnBoardingLayout>
  );
};

export default StepEight;

