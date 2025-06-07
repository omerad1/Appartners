import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import SurveyLayout from "../../components/survey/SurveyLayout";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { usePreferencesPayload } from "../../context/PreferencesPayloadContext";
import { Ionicons } from "@expo/vector-icons";
import { submitMultipleAnswers } from "../../api/questions";


const Wizard = () => {
  const { questions } = usePreferencesPayload();
  const navigation = useNavigation();
  
  // Transform the questions from context into the format expected by SurveyLayout
  const formattedSteps = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    
    // Process questions into steps with special handling for the first step
    const processedSteps = [];
    
    // Track if we've processed the first section yet
    let firstSectionProcessed = false;
    
    questions.forEach(section => {
      if (section.questions && section.questions.length > 0) {
        // Special handling for the first section (studying questions)
        if (!firstSectionProcessed && section.id === 1) {
          // Group the first two questions together
          const textQuestions = section.questions.filter(q => q.question_type === 'text');
          
          if (textQuestions.length >= 2) {
            // Create a combined first step with both text inputs
            processedSteps.push({
              title: section.title,
              input: textQuestions.map(q => ({
                title: q.title,
                placeholder: q.placeholder || 'Enter your answer',
                type: 'text',
                id: q.id
              })),
              ids: textQuestions.map(q => q.id) // Store all question IDs
            });
            firstSectionProcessed = true;
          }
        } else {
          // For all other sections, process questions individually
          section.questions.forEach(question => {
            if (question.question_type === 'text' && !(firstSectionProcessed && section.id === 1)) {
              // Format text input questions (skip if already included in first step)
              processedSteps.push({
                title: question.title,
                input: [{
                  title: question.title,
                  placeholder: question.placeholder || 'Enter your answer',
                  type: 'text',
                  id: question.id
                }],
                id: question.id
              });
            } else if (question.question_type === 'radio' && question.options) {
              // Format radio/scale questions
              processedSteps.push({
                title: question.title,
                radioBarOptions: [question.options.min, question.options.max],
                id: question.id
              });
            }
          });
        }
      }
    });
    
    return processedSteps;
  }, [questions]);
  
  const onFinish = async () => {
    // Format answers to match backend expectations
    const formattedAnswers = [];
    console.log("Current answers:", answers);
    
    Object.entries(answers).forEach(([index, value]) => {
      const step = formattedSteps[parseInt(index)];
      
      if (step && step.id) {
        // Handle empty strings as null for text inputs
        let finalValue = value;
        if (value === "") {
          finalValue = null;
        }
        
        formattedAnswers.push({
          questionId: step.id, // Use questionId to match the API expectation
          answer: finalValue
        });
      } else if (step && step.ids && Array.isArray(step.ids)) {
        // If this is a multi-question step and value is an array
        if (Array.isArray(value)) {
          // Match each answer with its question ID
          step.ids.forEach((qId, i) => {
            if (value[i] !== undefined) {
              // Handle empty strings as null
              let finalValue = value[i];
              if (finalValue === "") {
                finalValue = null;
              } else if (finalValue !== null) {
                finalValue = finalValue.toString();
              }
              
              formattedAnswers.push({
                questionId: qId, // Use questionId to match the API expectation
                answer: finalValue
              });
            }
          });
        }
      } else if (step && step.questionId) {
        // Regular single-question step
        // Handle empty strings as null
        let finalValue = value;
        if (finalValue === "") {
          finalValue = null;
        } else if (finalValue !== null) {
          finalValue = finalValue.toString();
        }
        
        formattedAnswers.push({
          questionId: step.questionId,
          answer: finalValue
        });
      }
    });
    
    console.log("Formatted answers for submission:", formattedAnswers);
    
    try {
      // Show loading state or disable buttons here if needed
      
      // Submit answers to the API
      const result = await submitMultipleAnswers(formattedAnswers);
      console.log('Survey answers submitted successfully:', result);
      
      // Navigate to the login screen after successful submission
      navigation.navigate("Login");
    } catch (error) {
      // Handle submission errors
      console.error('Failed to submit survey answers:', error);
      Alert.alert(
        "Submission Error",
        "There was a problem submitting your survey. Please try again.",
        [{ text: "OK" }]
      );
    }  
  };
  
  // Initialize default answers based on the formatted steps
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  
  // Set up default answers when steps are loaded
  useEffect(() => {
    if (formattedSteps.length > 0) {
      const defaultAnswers = formattedSteps.reduce((acc, step, index) => {
        if (step.radioBarOptions) {
          acc[index] = null; // Default value for scales (middle option)
        } else if (step.input) {
          acc[index] = ""; // Default value for inputs
        }
        return acc;
      }, {});
      
      setAnswers(defaultAnswers);
    }
  }, [formattedSteps]);

  const setAnswer = (value) => {
    // Handle both single values and arrays of values (for multi-question steps)
    setAnswers((prev) => ({ ...prev, [currentStep]: value }));
  };

  const nextStep = () => {
    // Save the current answer (already handled by setAnswer)
    // and move to the next step
    if (currentStep < formattedSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      // If not on the first question, go back to previous question
      setCurrentStep(currentStep - 1);
    } else {
      // If on the first question, navigate back to the last page (StepEight)
      navigation.navigate("OnBoarding", { screen: "StepEight" });
    }
  };
  
  // Set up custom back button behavior in the navigation header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      // Use the title to show which question we're on
      headerTitle: () => {
        if (!formattedSteps || formattedSteps.length === 0) {
          return <Text>Survey</Text>;
        }
        return <Text style={styles.headerTitle}>Question {currentStep + 1}/{formattedSteps.length}</Text>;
      },
      // Custom back button behavior with arrow and question number
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={previousStep}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, currentStep, formattedSteps]);

  // Show loading or error state if questions aren't loaded yet
  if (!formattedSteps || formattedSteps.length === 0) {
    return (
      <View style={styles.container}>
        <SurveyLayout
          step={1}
          setAnswer={() => {}}
          title="Loading questions..."
          currentAnswer={null}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <SurveyLayout
        step={currentStep + 1}
        setAnswer={setAnswer}
        title={formattedSteps[currentStep].title}
        input={formattedSteps[currentStep].input || null}
        radioBarOptions={formattedSteps[currentStep].radioBarOptions || null}
        onNext={nextStep}
        onFinish={onFinish}
        onBack={previousStep}
        isLastStep={currentStep === formattedSteps.length - 1}
        currentAnswer={answers[currentStep]}
      />
    </View>
  );
};

export default Wizard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerBackButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: "comfortaaSemiBold",
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});
