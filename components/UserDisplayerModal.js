import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import QuestionCompatibilityDrawer from './QuestionCompatibilityDrawer';

const UserDisplayerModal = ({ visible, onClose, user, onLike, onDislike, showActions = true, showQuestion = false}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [modalVisible, setModalVisible] = useState(visible);
  // Update modalVisible when visible prop changes
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  if (!user) return null;
  
  const {
    name,
    profile_image,
    bio,
    age,
    occupation,
    compatibility_score,
    questionnaire_responses: theirAnswers,
    liked_apartment: {
      user_details: {
        questionnaire_responses: myAnswers,
      } = {},
    } = {},
  } = user;
  const isStudent =
    occupation && (occupation.toLowerCase() === 'student' || occupation === 'סטודנט');

  const formatNameWithAge = (name, age) => {
    if (!age) return name;
    return `${name}, ${age}`;
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={28} color="#000" />
            </TouchableOpacity>

            <Image
              source={profile_image ? { uri: profile_image } : require('../assets/icons/crime.png')}
              style={styles.userImage}
              resizeMode="cover"
            />

            <View style={styles.userInfoOverlay}>
              <View style={styles.userInfoContent}>
                <Text style={styles.userName}>{formatNameWithAge(name, age)}</Text>
                {occupation && (
                  <View style={styles.occupationContainer}>
                    <Text style={styles.occupationText}>{occupation}</Text>
                    {isStudent && (
                      <MaterialCommunityIcons
                        name="school"
                        size={18}
                        color="#fff"
                        style={styles.schoolIcon}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>

            <ScrollView style={styles.bioContainer}>
              {showQuestion && (
                <View style={styles.matchBadgeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.matchBadge,
                      {
                        backgroundColor: 
                          (compatibility_score >= 75) ? '#E8F5E9' : // Light green bg for high match
                          (compatibility_score >= 335) ? '#FFF8E1' : // Light yellow bg for medium match
                          "#F44336"
                      }
                    ]}
                    onPress={() => {
                      setModalVisible(false); // Hide the Modal
                      setTimeout(() => {
                        setShowDrawer(true); // Open drawer after modal unmounts
                      }, 50);
                    }}
                  >
                    <Text 
                      style={[
                        styles.matchBadgeText, 
                        {
                          color: 
                            (compatibility_score >= 75) ? '#4CAF50' : // Green for high match
                            (compatibility_score >= 35) ? '#FFC107' : // Yellow for medium match
                            '#F44336'
                        }
                      ]}
                    >
                      {compatibility_score ?? 0}%
                    </Text>
                    <MaterialCommunityIcons name="help-circle-outline" size={18} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.bioTitle}>My bio</Text>
              <Text style={styles.bioText}>{bio || 'No bio available'}</Text>
            </ScrollView>

            {showActions && (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.dislikeButton} onPress={onDislike}>
                  <MaterialCommunityIcons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.likeButton} onPress={onLike}>
                  <MaterialCommunityIcons name="heart" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {showDrawer && (
        <QuestionCompatibilityDrawer
          visible={showDrawer}
          onClose={() => {
            setShowDrawer(false);
            // Reopen the modal after drawer closes
            setTimeout(() => {
              setModalVisible(true);
            }, 100);
          }}
          myAnswers={myAnswers}
          otherAnswers={theirAnswers}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: '100%',
    height: '60%',
  },
  userInfoOverlay: {
    position: 'absolute',
    bottom: '40%',
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  userInfoContent: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  occupationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  occupationText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '500',
  },
  schoolIcon: {
    marginLeft: 8,
  },
  bioContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    position: 'relative',
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'right',
  },
  bioText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    textAlign: 'right',
  },
  matchBadgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  matchBadgeText: {
    marginRight: 5,
    fontSize: 13,
    fontWeight: '600',
    color: '#00796B',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dislikeButton: {
    backgroundColor: '#8B4513',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  likeButton: {
    backgroundColor: '#FFC107',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default UserDisplayerModal;