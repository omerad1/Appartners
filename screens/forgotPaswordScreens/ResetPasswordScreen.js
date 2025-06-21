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
import BackgroundImage from '../../components/layouts/BackgroundImage';
import KeyboardAwareWrapper from '../../components/layouts/KeyboardAwareWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetPassword } from '../../api/auth/forgotPassword';

// Yup schema for password validation
const schema = yup.object().shape({
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

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email, otp } = route.params || {};
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Get the reset token from AsyncStorage
      const reset_token = await AsyncStorage.getItem('token');
      
      if (!reset_token) {
        Alert.alert('Error', 'Reset token not found. Please try the verification process again.');
        return;
      }
      
      // Call the resetPassword API with the new password and token
      const result = await resetPassword(data.newPassword, reset_token);
      
      if (result && result.success) {
        // Navigate to confirmation screen
        navigation.navigate('ConfirmationScreen', { email });
      } else {
        Alert.alert('Error', result?.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error?.message || 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequirement = (label, isFulfilled) => (
    <View style={styles.requirementRow} key={label}>
      <Icon
        name={isFulfilled ? 'checkmark-circle' : 'ellipse-outline'}
        size={20}
        color={isFulfilled ? '#4CAF50' : '#9E9E9E'}
      />
      <Text
        style={[
          styles.requirementText,
          { color: isFulfilled ? '#4CAF50' : '#333' },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req === true);

  return (
    <BackgroundImage opacity={0.5}>
      <KeyboardAwareWrapper style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Icon name="lock-open-outline" size={80} color="black" />
          </View>
          
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Create a new password for your account
          </Text>
          
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
            style={[styles.submitButton, !allRequirementsMet && styles.disabledButton]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || !allRequirementsMet}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareWrapper>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: '30%',
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'comfortaaBold',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '600',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
    width: '100%',
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
    width: '100%',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;