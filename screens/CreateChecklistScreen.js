import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { navigate } from './RootNavigation';


export default function CreateScreen({ navigation, route}) {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>SCREEN CREATE CHECKLIST</Text>
      <Text>{JSON.stringify(route.params.checklistData)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  
});