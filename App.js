import React from 'react';
import { Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import DrawerNavigation from './navigation/DrawerNavigation';
import LoginScreen from './screens/LoginScreen';
import { Icon } from 'react-native-elements'


import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false
        }}
      >
        <Stack.Screen name="LoginScr" component={LoginScreen}/>
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}