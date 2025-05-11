import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import QuestionScale from './survey/QuestionScale';

const QuestionItem = ({ question, index, initialValue, onSelect, disabled = false }) => {
  const renderQuestionContent = () => {
    switch (question.question_type) {
      case 'text':
        return (
          <View style={styles.textInputPlaceholder}>
            <Text style={styles.placeholderText}>{question.placeholder}</Text>
          </View>
        );
      case 'radio':
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
  placeholderText: {
    color: '#999',
    fontFamily: 'comfortaaRegular',
  },
});

export default QuestionItem;
