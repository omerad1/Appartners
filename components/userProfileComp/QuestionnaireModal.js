import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePreferencesPayload } from '../../context/PreferencesPayloadContext';
import DrawerModal from '../layouts/DrawerModal';
import QuestionItem from '../survey/QuestionItem';
import { getUserAnswers, submitMultipleAnswers } from '../../api/questions/index';


const QuestionnaireModal = ({ visible, onClose }) => {
  const { questions } = usePreferencesPayload();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [tabsVisible, setTabsVisible] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [pendingAnswers, setPendingAnswers] = useState({});
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
  const handleAnswerSelect = (questionId, value) => {
    // Handle empty string values for text inputs (questions 1 and 2)
    if ((questionId === 1 || questionId === 2) && value === '') {
      // Treat empty string as null for text inputs
      value = null;
    }
    
    // Only update the pending answers locally without submitting to server
    if (value === null) {
      // If answer is deselected or empty, remove it from pending answers
      setPendingAnswers(prev => {
        const newState = {...prev};
        delete newState[questionId];
        return newState;
      });
      
      // Also mark it as null in userAnswers if it exists there
      if (userAnswers[questionId]) {
        setUserAnswers(prev => {
          const newState = {...prev};
          delete newState[questionId];
          return newState;
        });
      }
    } else {
      // If a new answer is selected, add it to pending answers
      setPendingAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
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

  const handleNextSection = async () => {
    if (currentSectionIndex < questions.length - 1) {
      // Just move to the next section without saving
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      // If we're at the last section (Finish button), save all answers (both pending and previously saved)
      try {
        setIsSavingAnswer(true);
        
        // Combine previously saved answers with pending answers
        const combinedAnswers = { ...userAnswers, ...pendingAnswers };
        
        // Filter out any null, undefined, or empty string answers
        const filteredAnswers = {};
        Object.entries(combinedAnswers).forEach(([questionId, answer]) => {
          // Skip null, undefined, or empty string answers
          if (answer === null || answer === undefined || answer === '') {
            return;
          }
          
          // For questions 1 and 2 (text inputs), skip if they're empty strings
          if ((parseInt(questionId) === 1 || parseInt(questionId) === 2) && 
              (typeof answer === 'string' && answer.trim() === '')) {
            return;
          }
          
          // Otherwise, keep the answer
          filteredAnswers[questionId] = answer;
        });
        
        // Prepare all valid answers for submission
        const allAnswersToSubmit = Object.entries(filteredAnswers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer
        }));
        
        
        if (allAnswersToSubmit.length > 0) {
          // Submit all valid answers at once
          await submitMultipleAnswers(allAnswersToSubmit);
          
          // Update userAnswers with filtered answers
          setUserAnswers(filteredAnswers);
          
          // Clear pending answers
          setPendingAnswers({});
        }
        
        // Close the modal
        onClose();
      } catch (error) {
        console.error('Failed to save answers:', error);
        // Don't close the modal if there was an error
      } finally {
        setIsSavingAnswer(false);
      }
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
          initialValue={pendingAnswers[question.id] !== undefined ? pendingAnswers[question.id] : previousAnswer}
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
        
        <ScrollView style={styles.questionsScrollView}
                showsVerticalScrollIndicator={false}
>
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
