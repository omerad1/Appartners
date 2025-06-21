import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import EmailConfirmationScreen from "../screens/forgotPaswordScreens/EmailConfirmationScreen"
import ConfirmationScreen from "../screens/forgotPaswordScreens/ConfirmationScreen"
import OTPScreen from "../screens/forgotPaswordScreens/OTPScreen"
import ResetPasswordScreen from '../screens/forgotPaswordScreens/ResetPasswordScreen';


const Stack = createStackNavigator()

const ForgotPasswordNavigation = () => {
    return (
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            animationEnabled: true,
            headerTransparent: true,
            headerTintColor: 'black',
            headerLeftContainerStyle: {
              paddingLeft: 10,
            },
            headerBackTitleVisible: true,
          }}
        >
          <Stack.Screen 
            name="EmailConfirmationScreen" 
            component={EmailConfirmationScreen}
            options={{
              headerTitle: '',
              headerBackTitle: 'Back'
            }} 
          />
          <Stack.Screen 
            name="OTPScreen" 
            component={OTPScreen}
            options={{
              headerTitle: '',
              headerBackTitle: 'Email'
            }} 
          />
          <Stack.Screen 
            name="ResetPasswordScreen" 
            component={ResetPasswordScreen}
            options={{
              headerTitle: '',
              headerBackTitle: 'Verification'
            }}
          />
          <Stack.Screen 
            name="ConfirmationScreen" 
            component={ConfirmationScreen}
            options={{
              headerTitle: '',
              headerBackTitle: 'Password'
            }}
          />
        </Stack.Navigator>
      );
}

export default ForgotPasswordNavigation;