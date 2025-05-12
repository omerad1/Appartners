import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DrawerModal from './DrawerModal';
import { updateUserProfileData } from '../store/redux/userThunks';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfileModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const isLoading = useSelector(state => state.user.isProfileUpdating);
  const error = useSelector(state => state.user.profileUpdateError);

  // State for form fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    occupation: '',
    about_me: '',
  });
  
  // State for profile image
  const [profileImage, setProfileImage] = useState(null);

  // Initialize form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        occupation: currentUser.occupation || '',
        about_me: currentUser.about_me || '',
      });
      
      // Set profile image if available
      if (currentUser.photo_url) {
        setProfileImage(currentUser.photo_url);
      } else if (currentUser.photo) {
        setProfileImage(currentUser.photo);
      }
    }
  }, [currentUser]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection
  const handleImagePick = async () => {
    try {
      console.log('Image picker triggered');
      
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to access the media library.'
        );
        return;
      }

      // Launch the image picker with improved options
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Ensure the selected image is square
        quality: 0.8,
        // Remove the presentationStyle parameter that was causing the error
      });
      
      console.log('Image picker result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        console.log('Selected image:', selectedAsset);
        
        // Create the image object with all necessary information for FormData
        const imageInfo = {
          uri: selectedAsset.uri,
          type: selectedAsset.type || 'image/jpeg', // Default to jpeg if type is not provided
          name: selectedAsset.fileName || `profile-image-${Date.now()}.jpg`, // Generate a name if not provided
          size: selectedAsset.fileSize,
        };
        
        // Update the profile image state
        setProfileImage(imageInfo);
        console.log('Profile image updated successfully');
      } else {
        console.log('Image selection was canceled or no image was selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'There was a problem selecting an image. Please try again.'
      );
    }
  };
  
  // Handle save
  const handleSave = async () => {
    try {
      // Combine form data with profile image
      const updatedData = {
        ...formData,
        photo: profileImage
      };
      
      await dispatch(updateUserProfileData(updatedData));
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <DrawerModal
      visible={visible}
      onClose={onClose}
      title="Edit Profile"
      onSave={handleSave}
      saveButtonTitle="Save Changes"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {/* Profile Image Picker */}
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              {profileImage ? (
                // Display the selected image
                <Image 
                  source={{ uri: profileImage.uri || profileImage }} 
                  style={styles.profileImage} 
                />
              ) : (
                // Display a placeholder when no image is selected
                <View style={styles.placeholder}>
                  <Ionicons name="camera" size={36} color="#aaa" />
                  <Text style={styles.placeholderText}>Upload Image</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.imagePickerLabel}>Tap to change profile picture</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.first_name}
              onChangeText={(text) => handleChange('first_name', text)}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.last_name}
              onChangeText={(text) => handleChange('last_name', text)}
              placeholder="Enter your last name"
              placeholderTextColor="#999"
            />
          </View>



          <View style={styles.formGroup}>
            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              value={formData.occupation}
              onChangeText={(text) => handleChange('occupation', text)}
              placeholder="Enter your occupation"
              placeholderTextColor="#999"
            />
          </View>



          <View style={styles.formGroup}>
            <Text style={styles.label}>About Me</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.about_me}
              onChangeText={(text) => handleChange('about_me', text)}
              placeholder="Tell us about yourself"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Add spacing at the bottom for the save button */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </DrawerModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#d32f2f',
    fontFamily: 'comfortaaRegular',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 10,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // Adds shadow on Android
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 14,
    color: '#aaa',
  },
  imagePickerLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'comfortaaRegular',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'comfortaaSemiBold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: 'comfortaaRegular',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'comfortaaRegular',
  },
  bottomSpace: {
    height: 80, // Space for the save button
  },
});

export default EditProfileModal;
