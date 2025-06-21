import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import BackgroundImage from '../../components/layouts/BackgroundImage';
import KeyboardAwareWrapper from '../../components/layouts/KeyboardAwareWrapper';
import InputField from '../../components/onBoarding/InputField';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emailVerifcation } from "../../api/auth/forgotPassword"

const EmailConfirmationScreen = ({ navigation }) => {
  // Email validation schema using Yup
  const emailSchema = yup.object().shape({
    email: yup.string()
      .required('Please enter your email address')
      .email('Please enter a valid email address')
  });

  // Initialize React Hook Form with Yup resolver
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: ''
    }
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await emailVerifcation(data.email);
      
      if (result.success) {
        // Navigate to OTP screen with the email
        navigation.navigate('OTPScreen', { email: data.email });
      } else {
        // Handle error that could be a string or an object
        let errorMessage = 'Failed to verify email';
        
        if (typeof result.error === 'object' && result.error !== null) {
          // If error is an object, extract the error message
          errorMessage = result.error.error || result.error.message || JSON.stringify(result.error);
        } else if (typeof result.error === 'string') {
          errorMessage = result.error;
        }
        
        // Show error in a nice popup alert
        Alert.alert(
          'Verification Failed',
          errorMessage,
          [{ text: 'OK', style: 'cancel' }]
        );
      }
    } catch (err) {
      // Show generic error in a popup alert
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK', style: 'cancel' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImage opacity={0.5}>
      <KeyboardAwareWrapper style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Icon name="lock-closed-outline" size={80} color="black" />
          </View>
          
          <Text style={styles.title}>Forgot Password</Text>
          
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a verification code to reset your password.
          </Text>
          
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="Email"
                value={value}
                onChange={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          {/* Error handling is now done with Alert popups */}
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareWrapper>
    </BackgroundImage>
  );
};

export default EmailConfirmationScreen;

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
  inputField: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
});