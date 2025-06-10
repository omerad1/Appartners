import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DrawerModal from '../layouts/DrawerModal';
import QuestionScale from './QuestionScale';
import { usePreferencesPayload } from '../../context/PreferencesPayloadContext';

const QuestionCompatibilityDrawer = ({
  visible,
  onClose,
  myAnswers,
  otherAnswers,
}) => {
  const { questions } = usePreferencesPayload();
  const [allQuestions, setAllQuestions] = useState([]);
  console.log("my", myAnswers)
  console.log("other", otherAnswers)

  useEffect(() => {
    if (questions?.length > 0) {
      const allQuestionsFlat = [];

      questions.forEach((section) => {
        if (section.id !== 1) {
          section.questions.forEach((question) => {
            const myAnswer = myAnswers?.find((a) => a.question.id === question.id);
            const theirAnswer = otherAnswers?.find((a) => a.question.id === question.id);

            if (typeof theirAnswer?.numeric_response === 'number') {
              allQuestionsFlat.push({
                questionId: question.id,
                question: question.title,
                options: question.options,
                myValue:
                  typeof myAnswer?.numeric_response === 'number'
                    ? myAnswer.numeric_response
                    : null,
                theirValue: theirAnswer.numeric_response,
                mySkipped: typeof myAnswer?.numeric_response !== 'number',
              });
            }
          });
        }
      });

      setAllQuestions(allQuestionsFlat);
    }
  }, [questions, myAnswers, otherAnswers]);

  const renderItem = ({ item }) => {
    const { min, max } = item.options || { min: 'Low', max: 'High' };

    return (
      <View style={styles.itemContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionText}>{item.question}</Text>
        </View>

        <View style={styles.answersContainer}>
          {/* Their Answer */}
          <View style={styles.answerCard}>
            <View style={styles.answerHeader}>
              <View style={styles.answerIndicator}>
                <View style={[styles.avatarDot, { backgroundColor: '#FF6B9D' }]} />
                <Text style={styles.answerLabel}>Them</Text>
              </View>
            </View>
            <View style={styles.scaleWrapper}>
              <QuestionScale
                initialValue={item.theirValue}
                minLabel={min}
                maxLabel={max}
                disabled
              />
            </View>
          </View>

          {/* Your Answer */}
          <View style={styles.answerCard}>
            <View style={styles.answerHeader}>
              <View style={styles.answerIndicator}>
                <View style={[styles.avatarDot, { backgroundColor: '#4A90E2' }]} />
                <Text style={styles.answerLabel}>You</Text>
              </View>
            </View>
            {item.mySkipped ? (
              <Text style={styles.skippedText}>You skipped this question</Text>
            ) : (
              <View style={styles.scaleWrapper}>
                <QuestionScale
                  initialValue={item.myValue}
                  minLabel={min}
                  maxLabel={max}
                  disabled
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <DrawerModal visible={visible} onClose={onClose} title="Answered Questions">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={allQuestions}
        keyExtractor={(item) => item.questionId.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>They didn't answer any questions yet</Text>
          </View>
        }
      />
    </DrawerModal>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  itemContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'visible',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FAFBFC',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  answersContainer: {
    gap: 16,
  },
  answerCard: {
    padding: 10,
    paddingBottom: 0,
    width: '100%',
    overflow: 'hidden',
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  scaleWrapper: {
    transform: [{ scale: 0.8 }],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QuestionCompatibilityDrawer;
