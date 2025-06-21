import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import BackgroundImage from '../../components/layouts/BackgroundImage'
import Icon from 'react-native-vector-icons/Ionicons'
import { CommonActions } from '@react-navigation/native'

const ConfirmationScreen = ({ navigation, route }) => {
  const { email } = route.params || {};

  const handleLoginPress = () => {
    // Navigate to the login screen and reset the navigation stack
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Login' },
        ],
      })
    );
  };

  return (
    <BackgroundImage opacity={0.5}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Icon name="checkmark-circle-outline" size={120} color="black" />
          </View>
          
          <Text style={styles.title}>Password Updated!</Text>
          
          <Text style={styles.subtitle}>
            Your password has been successfully reset. You can now log in with your new password.
          </Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLoginPress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundImage>
  )
}

export default ConfirmationScreen

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
    paddingTop: "30%"
  },
  iconContainer: {
    marginBottom: 30,
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
    fontSize: 20,
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})