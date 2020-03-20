import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground,Alert } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { FlatList } from 'react-native-gesture-handler';
import CreateChecklist from './CreateChecklistScreen';

function Home({navigation}) {
  const data = [
    { key: 1, label: 'CHECKLIST', crear: 'CREAR', ver: 'VER', image: require('./../assets/checklist.png') },
    // { key: 2, label: 'COMBUSTIBLES', crear: 'CREAR', ver: 'VER', image: require('./../assets/combustible.png') },
    // { key: 3, label: 'OTROS GASTOS', crear: 'CREAR', ver: 'VER', image: require('./../assets/otrosGastos.png') },
    // { key: 4, label: 'NOVEDADES', crear: 'CREAR', ver: 'VER', image: require('./../assets/novedades.png') },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={()=>_onPress(item,navigation)}>
            <ImageBackground source={item.image} style={styles.elementList}>
              <Text style={styles.textList}>{item.label}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function _onPress(item,navigation){
  navigation.navigate("CreateChecklist");
}

const Stack = createStackNavigator();

export default function HomeScreen({ navigation }) {

  return (
    <Stack.Navigator
      initialRouteName={"Home"}
      screenOptions={{ 
        headerStyle: {
          backgroundColor: '#E0A729',
          height: Platform.OS === 'ios' ? 105 : 85
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center'
       }}>
      <Stack.Screen
        name="Home" 
        component={Home}
        options={{
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
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="CreateChecklist" 
        component={CreateChecklist}
        options={{
          title: 'Crear Checklist',
        }}
      />   
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  MenuStyle: {
    margin: 20
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 40,
    paddingRight: 20,
  },
  backTextWhite: {
    color: '#FFF',
  },

  elementList:{
    paddingLeft:150,
    marginTop:10,
    marginLeft:20, 
    height: 160,
    justifyContent:'center'
  },

  textList: {
    fontSize: 20,
    color:'black',
    fontWeight: 'bold', 
    textAlign:'left',
  },
  
  textCreate:{
    backgroundColor:'#A5FF8B',
    padding:10,
    paddingTop:25,
    paddingBottom:25,
    textAlign:'center',

  },
  textView:{
    backgroundColor:'#8BFFEA',
    padding:10,
    paddingTop:25,
    paddingBottom:25,
    textAlign:'center'

  }

});