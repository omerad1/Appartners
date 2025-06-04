import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Snackbar } from 'react-native-paper';
import { changePassword } from '../../api/user';

// Yup schema for password validation
const schema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 number'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const ChangePasswordScreen = ({ onGoBack }) => {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordText, setNewPasswordText] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
  });

  useEffect(() => {
    setPasswordRequirements({
      minLength: newPasswordText.length >= 8,
      hasLowercase: /[a-z]/.test(newPasswordText),
      hasUppercase: /[A-Z]/.test(newPasswordText),
      hasNumber: /[0-9]/.test(newPasswordText),
    });
  }, [newPasswordText]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await changePassword(data.currentPassword, data.newPassword);
      setSnackbarMessage('Password changed successfully');
      setSnackbarVisible(true);
      reset();
      setNewPasswordText('');
      setTimeout(() => {
        if (onGoBack) {
          onGoBack();
        }
      }, 2000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to change password';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequirement = (label, isFulfilled) => (
    <View style={styles.requirementRow} key={label}>
      <Icon
        name={isFulfilled ? 'checkmark-circle' : 'ellipse-outline'}
        size={16}
        color={isFulfilled ? '#4CAF50' : '#9E9E9E'}
      />
      <Text
        style={[
          styles.requirementText,
          { color: isFulfilled ? '#4CAF50' : '#9E9E9E' },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Current Password Field */}
      <View style={styles.passwordContainer}>
        <Controller
          name="currentPassword"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.currentPassword && styles.inputError,
              ]}
              placeholder="Current Password"
              secureTextEntry={!currentPasswordVisible}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}
        >
          <Icon name={currentPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
        {errors.currentPassword && (
          <Text style={styles.errorText}>{errors.currentPassword.message}</Text>
        )}
      </View>

      {/* New Password Field */}
      <View style={styles.passwordContainer}>
        <Controller
          name="newPassword"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.newPassword && styles.inputError,
              ]}
              placeholder="New Password"
              secureTextEntry={!newPasswordVisible}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setNewPasswordText(text);
              }}
            />
          )}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setNewPasswordVisible(!newPasswordVisible)}
        >
          <Icon name={newPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
        {errors.newPassword && (
          <Text style={styles.errorText}>{errors.newPassword.message}</Text>
        )}
      </View>

      {/* Password Requirements */}
      <View style={styles.requirementsContainer}>
        {renderRequirement('At least 8 characters', passwordRequirements.minLength)}
        {renderRequirement('At least 1 lowercase letter (a-z)', passwordRequirements.hasLowercase)}
        {renderRequirement('At least 1 uppercase letter (A-Z)', passwordRequirements.hasUppercase)}
        {renderRequirement('At least 1 number (0-9)', passwordRequirements.hasNumber)}
      </View>

      {/* Confirm New Password Field */}
      <View style={styles.passwordContainer}>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm New Password"
              secureTextEntry={!confirmPasswordVisible}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        >
          <Icon name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>Change Password</Text>
        )}
      </TouchableOpacity>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
    fontFamily: 'comfortaaSemiBold',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    color: '#000',
  },
  passwordInput: {
    paddingRight: 45,
  },
  inputError: {
    borderColor: 'red',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 5,
  },
  requirementsContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'comfortaaSemiBold',
  },
});

export default ChangePasswordScreen;
