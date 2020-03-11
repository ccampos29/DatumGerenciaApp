import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList} from 'react-native';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';

const data = [
  {id:1, text: "CHECKLIST"},
  {id:2, text: "COMBUSTIBLE"},
  {id:3, text: "OTROS GASTOS"},
  {id:4, text: "NOVEDADES"},
]

function Home(){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList
        data={this.data}
        keyExtractor={(item) => (item.item).toString()}
        ItemSeparatorComponent={() => <View style={styles.ItemSeparator}></View>}
        contentContainerStyle ={{borderBottomColor: 'grey', borderBottonWidth:1 }}
        renderItem={({item, index}) => <listItem item={item} index={index}/>}
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