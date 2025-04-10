import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UserDisplayerModal = ({ visible, onClose, user, onLike, onDislike }) => {
  if (!user) return null;

  const { name, profile_image, bio, age, university } = user;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header with close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={28} color="#000" />
          </TouchableOpacity>

          {/* User Image */}
          <Image 
            source={typeof profile_image === 'string' ? { uri: profile_image } : profile_image}
            style={styles.userImage}
            resizeMode="cover"
          />

          {/* User Info Overlay */}
          <View style={styles.userInfoOverlay}>
            <View style={styles.userInfoContent}>
              <Text style={styles.userName}>{name}{age ? `, ${age}` : ''}</Text>
              {university && (
                <View style={styles.universityContainer}>
                  <Text style={styles.universityText}>{university}</Text>
                  <MaterialCommunityIcons name="school" size={18} color="#fff" style={styles.universityIcon} />
                </View>
              )}
            </View>
          </View>

          {/* Bio Section */}
          <ScrollView style={styles.bioContainer}>
            <Text style={styles.bioTitle}>My bio</Text>
            <Text style={styles.bioText}>{bio || 'No bio available'}</Text>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.dislikeButton} onPress={onDislike}>
              <MaterialCommunityIcons name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton} onPress={onLike}>
              <MaterialCommunityIcons name="check" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
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
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userInfoContent: {
    alignItems: 'flex-end', 
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'right', 
  },
  universityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  universityText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'right', 
  },
  universityIcon: {
    marginLeft: 8, 
  },
  bioContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  dislikeButton: {
    backgroundColor: '#FF4949',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  likeButton: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});

export default UserDisplayerModal;