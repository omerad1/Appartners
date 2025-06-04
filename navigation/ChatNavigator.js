import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AllChatsScreen from '../screens/chatScreens/AllChatsScreen';
import ChatScreen from '../screens/chatScreens/ChatScreen';

const Stack = createStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="AllChats" component={AllChatsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}
