import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';



function Create(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>SCREEN CREATE CHECKLIST</Text>
    </View>
  );  
}


export default function CreateScreen({ navigation }) {
  // const [state, setState] = React.useState('');
  
  // _getUser = async () =>{
  //   let user;
  //   try {
  //     user = await AsyncStorage.getItem('userToken');
  //   } catch(e) {
  //     console.log('error obteniendo data');
  //   }

  //   setState({username:user});
  // }

  // _getUser();

  return (
      Create()
  );
}

const styles = StyleSheet.create({
  MenuStyle: {
    margin: 20
  },
});