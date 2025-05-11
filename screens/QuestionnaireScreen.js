import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import QuestionnaireModal from '../components/QuestionnaireModal';
import { usePreferencesPayload } from '../context/PreferencesPayloadContext';

const QuestionnaireScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { questions, isLoading } = usePreferencesPayload();

  const openQuestionnaire = () => {
    setModalVisible(true);
  };

  const closeQuestionnaire = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Roommate Questionnaire</Text>
        <Text style={styles.description}>
          Answer a few questions to help us find your perfect roommate match!
        </Text>
        
        {isLoading ? (
          <Text style={styles.loadingText}>Loading questions...</Text>
        ) : (
          <TouchableOpacity 
            style={styles.button} 
            onPress={openQuestionnaire}
          >
            <Text style={styles.buttonText}>Start Questionnaire</Text>
          </TouchableOpacity>
        )}

        {questions && questions.length > 0 && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {questions.length} sections with a total of {questions.reduce(
                (total, section) => total + section.questions.length, 0
              )} questions
            </Text>
          </View>
        )}
      </View>

      <QuestionnaireModal 
        visible={modalVisible} 
        onClose={closeQuestionnaire} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'comfortaaBold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'comfortaaRegular',
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'comfortaaSemiBold',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'comfortaaMedium',
    color: '#666',
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#666',
    textAlign: 'center',
  },
});

export default QuestionnaireScreen;
