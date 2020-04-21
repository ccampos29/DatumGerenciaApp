import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';

function About(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Información general de la aplicación</Text>
    </View>
  );  
}

const Stack = createStackNavigator();

export default function AboutScreen({ navigation }) {

  //console.log("pantalla about");

  return (
      <Stack.Navigator>
        <Stack.Screen 
          name="About" 
          component={About}
          options={{
            title: 'Acerca de',
            headerLeft: () => (
              <TouchableOpacity 
                style= {styles.MenuStyle}
                onPress={() => navigation.toggleDrawer()}
                hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
                <Icon
                  name='bars'
                  type='font-awesome'
                  color='#FFFFFF'
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#E0A729',
              height: Platform.OS === 'ios' ? 105 : 85
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center'
          }}/>
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  MenuStyle: {
    margin: 20
  },
});