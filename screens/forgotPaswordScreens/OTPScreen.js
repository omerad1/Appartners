import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { OtpInput } from 'react-native-otp-entry';
import BackgroundImage from '../../components/layouts/BackgroundImage';
import KeyboardAwareWrapper from '../../components/layouts/KeyboardAwareWrapper';
import { otpVerifcation, emailVerifcation} from '../../api/auth/forgotPassword';

const OTPScreen = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [otpCode, setOtpCode] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(60);
    
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (code) => {
    setOtpCode(code);
    setIsValid(true);
  };

  const handleSubmit = async () => {
    if (otpCode.length !== 6) {
      setIsValid(false);
      Alert.alert('Invalid Code', 'Please enter a valid 6-digit code');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await otpVerifcation(email, otpCode);
      
      if (result && result.success) {
        // Navigate to reset password screen with email and OTP
        navigation.navigate('ResetPasswordScreen', { email, otp: otpCode });
      } else {
        setIsValid(false);
        
        // Handle error that could be a string or an object
        let errorMessage = 'Invalid verification code';
        
        if (typeof result?.error === 'object' && result?.error !== null) {
          // If error is an object, extract the error message
          errorMessage = result.error.error || result.error.message || JSON.stringify(result.error);
        } else if (typeof result?.error === 'string') {
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
      setIsValid(false);
      
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

  const handleResendCode = async () => {
    if (!isResendDisabled) {
      // Implement resend code functionality here
      setLoading(true)
        try {
              const result = await emailVerifcation(email);
              
              if (result.success) {
                // Navigate to OTP screen with the email
                Alert.alert(
                    'OTP Successfull',
                    'New password was sent to your email',
                    [{ text: 'OK', style: 'cancel' }]
                  );
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
    }
}


  return (
    <BackgroundImage opacity={0.5}>
      <KeyboardAwareWrapper style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Icon name="shield-checkmark-outline" size={80} color="black" />
          </View>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            Please enter the 6-digit code sent to
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={6}
              onTextChange={handleOtpChange}
              theme={{
                containerStyle: styles.otpInputContainer,
                inputsContainerStyle: styles.otpInputsContainer,
                pinCodeContainerStyle: styles.otpDigitContainer,
                pinCodeTextStyle: styles.otpDigitText,
                focusStickStyle: styles.otpFocusStick,
                focusedPinCodeContainerStyle: styles.otpDigitContainerFocused,
              }}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity 
              onPress={handleResendCode}
              disabled={isResendDisabled}
            >
              <Text style={[styles.resendButtonText, isResendDisabled && styles.disabledText]}>
                {isResendDisabled ? `Resend (${timer}s)` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '600',
  },
  emailText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInputContainer: {
    width: '100%',
  },
  otpInputsContainer: {
    width: '100%',
    justifyContent: 'space-between',
  },
  otpDigitContainer: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigitContainerFocused: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  otpDigitText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  otpFocusStick: {
    backgroundColor: '#000',
    height: 2,
    width: 20,
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
  resendContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#666',
  },
  resendButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  disabledText: {
    color: '#999',
    textDecorationLine: 'none',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
});

export default OTPScreen;