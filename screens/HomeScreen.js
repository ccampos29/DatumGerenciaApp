import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';


function Home() {
  const data = [
    { key: 1, label: 'CHECKLIST', crear: 'CREAR', ver: 'VER' },
    { key: 2, label: 'COMBUSTIBLES', crear: 'CREAR', ver: 'VER' },
    { key: 3, label: 'OTROS GASTOS', crear: 'CREAR', ver: 'VER' },
    { key: 4, label: 'NOVEDADES', crear: 'CREAR', ver: 'VER' },
  ];

  return (
    <View style={styles.container}>
      <SwipeableFlatList
        data={data}
        renderItem={({ item }) => (
          <Text style={{ marginTop:30, marginLeft:30,height: 48 }}>{item.label}</Text>
        )}
        // renderLeft={({ item }) => (
        //     <Text style={{ width: 40 }}>{item.leftLabel}</Text>
        // )}
        renderRight={({ item }) => (
          //<Text style={{ width: 100}}>{item.rightLabel}</Text>
          <TouchableOpacity style={{marginTop:30, width: 80 }}>
            <Text>
              {item.crear}
            </Text>
          </TouchableOpacity>
          // <TouchableOpacity style={{ marginLeft:10}}>
          //   <Text>
          //     {item.ver}
          //   </Text>
          // </TouchableOpacity>
        )}
        backgroundColor={'white'}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function HomeScreen({ navigation }) {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          headerLeft: () => (
            <TouchableOpacity
              style={styles.MenuStyle}
              onPress={() => navigation.toggleDrawer()}
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
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
        }} />
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
  },
  backTextWhite: {
    color: '#FFF',
  },

  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },

});