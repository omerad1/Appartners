import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePreferencesPayload } from '../context/PreferencesPayloadContext';
import DrawerModal from './DrawerModal';
import QuestionItem from './QuestionItem';
import { getUserAnswers, submitAnswer } from '../api/questions';


const QuestionnaireModal = ({ visible, onClose }) => {
  const { questions } = usePreferencesPayload();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [tabsVisible, setTabsVisible] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  
  // Fetch user's previous answers when modal becomes visible
  useEffect(() => {
    if (visible && questions && questions.length > 0) {
      fetchUserAnswers();
    }
  }, [visible, questions]);
  
  // Function to fetch user's previous answers
  const fetchUserAnswers = async () => {
    try {
      setIsLoadingAnswers(true);
      const answers = await getUserAnswers();
      

      // Convert array of answers to a map for easier lookup
      const answersMap = {};
      
      // Process each answer and map it to the corresponding question ID
      answers.forEach(answer => {
        // Extract the question ID - handle both formats (nested object or direct ID)
        let questionId;
        if (answer.question && typeof answer.question === 'object') {
          questionId = answer.question.id;
        } else {
          questionId = answer.question_id || answer.question;
        }
        
        // Determine which field contains the answer value
        let answerValue;
        if (answer.numeric_response !== undefined && answer.numeric_response !== null) {
          answerValue = answer.numeric_response;
        } else if (answer.text_response !== undefined && answer.text_response !== null) {
          answerValue = answer.text_response;
        } else if (answer.answer !== undefined && answer.answer !== null) {
          answerValue = answer.answer;
        }
        
        // Store the answer in the map if we have both a question ID and a value
        if (questionId !== undefined && answerValue !== undefined) {

          answersMap[questionId] = answerValue;
        }
      });
      

      setUserAnswers(answersMap);
    } catch (error) {
      console.error('Failed to fetch user answers:', error);
    } finally {
      setIsLoadingAnswers(false);
    }
  };
  
  // Function to handle when a user selects an answer
  const handleAnswerSelect = async (questionId, value) => {
    try {
      setIsSavingAnswer(true);
      
      // Update local state immediately for responsive UI
      if (value === null) {
        // If answer is deselected, remove it from the local state
        setUserAnswers(prev => {
          const newState = {...prev};
          delete newState[questionId];
          return newState;
        });
      } else {
        // If a new answer is selected, add it to the local state
        setUserAnswers(prev => ({
          ...prev,
          [questionId]: value
        }));
      }
      
      // Submit the answer to the server (submitAnswer function will handle null values)
      await submitAnswer(questionId, value);
    } catch (error) {
      console.error('Failed to save answer:', error);
      // Revert the local state if the server request fails
      setUserAnswers(prev => {
        const newState = {...prev};
        if (value === null) {
          // If we were trying to delete an answer, restore the previous value
          if (prev[questionId] !== undefined) {
            newState[questionId] = prev[questionId];
          }
        } else {
          // If we were trying to add/update an answer, remove or restore as needed
          if (prev[questionId] === undefined) {
            delete newState[questionId];
          } else {
            newState[questionId] = prev[questionId];
          }
        }
        return newState;
      });
    } finally {
      setIsSavingAnswer(false);
    }
  };

  // If questions are not loaded yet, show loading
  if (!questions || questions.length === 0) {
    return (
      <DrawerModal
        visible={visible}
        onClose={onClose}
        title="Questionnaire"
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </DrawerModal>
    );
  }
  
  // If we're still loading the user's answers, show a loading indicator
  if (isLoadingAnswers) {
    return (
      <DrawerModal
        visible={visible}
        onClose={onClose}
        title="Questionnaire"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFE100" />
          <Text style={styles.loadingText}>Loading your answers...</Text>
        </View>
      </DrawerModal>
    );
  }

  const currentSection = questions[currentSectionIndex];

  const handleNextSection = () => {
    if (currentSectionIndex < questions.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      // If we're at the last section, close the modal
      onClose();
    }
  };

  const renderQuestionWithSeparator = (question, index, isLast) => {
    // Get the user's previous answer for this question, if any
    const previousAnswer = userAnswers[question.id];
    
    return (
      <React.Fragment key={question.id}>
        <QuestionItem 
          question={question} 
          index={index}
          initialValue={previousAnswer}
          onSelect={(value) => handleAnswerSelect(question.id, value)}
          disabled={isSavingAnswer}
        />
        {!isLast && <View style={styles.separator} />}
      </React.Fragment>
    );
  };

  // Render tabs for section navigation
  const renderTabs = () => {
    if (!tabsVisible || questions.length <= 1) return null;
    
    return (
      <View style={styles.tabsContainer}>
        {questions.map((section, index) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              currentSectionIndex === index && styles.activeTab
            ]}
            onPress={() => setCurrentSectionIndex(index)}
          >
            <Text 
              style={[
                styles.tabText,
                currentSectionIndex === index && styles.activeTabText
              ]}
              numberOfLines={1}
            >
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <DrawerModal
      visible={visible}
      onClose={onClose}
      title="Questionnaire"
      onSave={handleNextSection}
      saveButtonTitle={currentSectionIndex === 0 ? "Next" : "Finish"}
    >
      <View style={styles.container}>
        {renderTabs()}
        
        {/* Section description removed as requested */}
        
        <ScrollView style={styles.questionsScrollView}>
          {currentSection.questions.map((question, index) => 
            renderQuestionWithSeparator(
              question, 
              index, 
              index === currentSection.questions.length - 1
            )
          )}
        </ScrollView>
      </View>
    </DrawerModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 70, // Space for the footer button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'comfortaaMedium',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'rgb(255, 225, 0)',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'comfortaaMedium',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  activeTabText: {
    color: '#333',
    fontFamily: 'comfortaaSemiBold',
  },
  sectionDescription: {
    fontSize: 16,
    fontFamily: 'comfortaaMedium',
    color: '#666',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  questionsScrollView: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    paddingBottom: 5,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#999',
  },
});

export default QuestionnaireModal;
