import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import QuestionScale from './survey/QuestionScale';

const QuestionItem = ({ question, index, initialValue, onSelect, disabled = false }) => {

  // Initialize input value with existing data if available
  const [inputValue, setInputValue] = useState(initialValue !== null && initialValue !== undefined ? String(initialValue) : '');
  
  // Update local state if initialValue changes (e.g., when answers are loaded from server)
  React.useEffect(() => {
    if (initialValue !== null && initialValue !== undefined) {
      setInputValue(String(initialValue));
    }
  }, [initialValue]);

  const renderQuestionContent = () => {
    switch (question.question_type) {
      case 'text':
        // For text questions, display an interactive TextInput
        // Use numeric keyboard for the second question (index 1) in the first tab
        const keyboardType = index === 1 ? 'numeric' : 'default';
        
        return (
          <TextInput
            style={styles.textInput}
            placeholder={question.placeholder}
            placeholderTextColor="#999"
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              // Convert to number for numeric inputs if needed
              const parsedValue = keyboardType === 'numeric' && text !== '' ? Number(text) : text;
              onSelect(parsedValue);
            }}
            keyboardType={keyboardType}
            editable={!disabled}
          />
        );
      case 'radio':
        // For radio/scale questions, use the QuestionScale component
        return (
          <QuestionScale 
            minLabel={question.options?.min} 
            maxLabel={question.options?.max}
            initialValue={initialValue}
            onSelect={onSelect}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionNumber}>Question {index + 1}</Text>
      <Text style={styles.questionTitle}>{question.title}</Text>
      {renderQuestionContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  questionNumber: {
    fontSize: 12,
    fontFamily: 'comfortaaRegular',
    color: '#999',
    marginBottom: 5,
  },
  questionTitle: {
    fontSize: 16,
    fontFamily: 'comfortaaSemiBold',
    marginBottom: 12,
    color: '#333',
  },
  likertScaleWrapper: {
    transform: [{ scale: 0.65 }],  // Scale down the LikertScale component to 65% of its original size
    marginTop: -15,               // Adjust top margin to compensate for scaling
    marginBottom: -15,            // Adjust bottom margin to compensate for scaling
    alignItems: 'center',         // Center the scaled component
  },
  textInputPlaceholder: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    fontFamily: 'comfortaaMedium',
    color: '#333',
  },
  placeholderText: {
    color: '#999',
    fontFamily: 'comfortaaRegular',
  },
  savedAnswerText: {
    color: '#333',
    fontFamily: 'comfortaaMedium',
  },
});

export default QuestionItem;
