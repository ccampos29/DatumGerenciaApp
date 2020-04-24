import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground, Alert } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { FlatList } from 'react-native-gesture-handler';
import CreateChecklist from './CreateChecklistScreen';
import { navigate } from './RootNavigation';
import { AuthContext } from './../context/AuthContext';
import ChecklistScreen from './ChecklistScreen';
import CreateFuel from './CreateFuelScreen';

import AwesomeAlert from 'react-native-awesome-alerts';

function Home({ navigation, route }) {
  const data = [
    { key: '1', label: 'CHECKLIST', crear: 'CREAR', ver: 'VER', image: require('./../assets/checklist.png') },
    { key: '2', label: 'COMBUSTIBLES', crear: 'CREAR', ver: 'VER', image: require('./../assets/combustible.png') },
    // { key: 3, label: 'OTROS GASTOS', crear: 'CREAR', ver: 'VER', image: require('./../assets/otrosGastos.png') },
    // { key: 4, label: 'NOVEDADES', crear: 'CREAR', ver: 'VER', image: require('./../assets/novedades.png') },
  ];

  const { spinnerOn } = React.useContext(AuthContext);
  const { spinnerOff } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => _onPress(item, navigation, route, spinnerOn, spinnerOff)}>
            <ImageBackground source={item.image} style={styles.elementList}>
              <Text style={styles.textList}>{item.label}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

async function _onPress(item, navigation, route, spinnerOn, spinnerOff) {
  //Autenticar el usuario

  if (item.key === '1') {
    spinnerOn();

    var parametros = new URLSearchParams({
      user_id: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
      //user_id: 18,
    });

    var url = 'http://gerencia.datum-position.com/api/checklist/getvehiclebyuser?' + parametros.toString();

    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + route.params.userToken.token
      }
    }).then(res => res.json())
      .then(resData => {
       // console.log(resData);
        if (resData.status === "success") {
          console.log("////////////////////////////////////////////////");
          spinnerOff();
          navigation.navigate("CreateChecklist", { userToken: route.params.userToken, checklistData: resData.vehiculos });
        } else {
          spinnerOff();
          alert("Error autenticando el usuario para la creación de checklist");
        }
      }).catch(e => {
        alert("Error comunicandose con Datum Gerencia");
        spinnerOff();
      });
  }

  if (item.key === '2') {
    spinnerOn();

    var parameters = new URLSearchParams({
      id_user: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
      id_empresa: route.params.userToken.userCompanyId,
      //id_user: 18,
    });
    var parametros = new URLSearchParams({
      user_id: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
      //user_id: 18,
    });

    var urlFuel = 'http://gerencia.datum-position.com/Api/combustible/createcombustible?' + parameters.toString();
    var urlVehicle = 'http://gerencia.datum-position.com/Api/checklist/getvehiclebyuser?' + parametros.toString();
    console.log(urlFuel);
    var fuelData;
    var vehicleData;
    await fetch(urlFuel, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + route.params.userToken.token
      }
    }).then(res => res.json())
      .then(resData => {
        if(typeof resData.centrosCostos !== 'undefined'){
          fuelData = resData;
          return fetch(urlVehicle, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + route.params.userToken.token}
            });
          
          //navigation.navigate("CreateFuel", { userToken: route.params.userToken, fuelData: resData });
        } 
      }).then(res=>res.json())
        .then(resData =>{
          if (resData.status === "success") {
            vehicleData = resData.vehiculos;
            return fetch('http://gerencia.datum-position.com/pais/pais-list', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });  
          }
      }).then(res=>res.json())
        .then(resData =>{
          //console.log(resData);
          if (typeof resData !== 'undefined') {
            spinnerOff();
            navigation.navigate("CreateFuel", { userToken: route.params.userToken, fuelData: fuelData, vehicleData: vehicleData, countryData: resData });
          } else {
            spinnerOff();
            alert("Error autenticando el usuario para la creación de checklist");
          }
      }).catch(e => {
        alert("Error comunicandose con Datum Gerencia");
        spinnerOff();
      });
  }
}

const Stack = createStackNavigator();

export default function HomeScreen(props) {

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
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        initialParams={{ userToken: props.route.params.userToken }}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              style={styles.MenuStyle}
              onPress={() => props.navigation.toggleDrawer()}
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
              <Icon
                name='bars'
                type='font-awesome'
                color='#FFFFFF'
              />
            </TouchableOpacity>
          ),
          title: 'Inicio',
        }}
      />
      <Stack.Screen
        name="CreateChecklist"
        component={CreateChecklist}
        options={{
          title: 'Crear Checklist',
        }}
      />
      <Stack.Screen
        name="ChecklistScreen"
        component={ChecklistScreen}
        options={{
          title: 'Llenar Checklist',
        }}
      />
      <Stack.Screen
        name="CreateFuel"
        component={CreateFuel}
        options={{
          title: 'Crear Combustible',
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

  elementList: {
    paddingLeft: 150,
    marginTop: 10,
    marginLeft: 20,
    height: 160,
    justifyContent: 'center'
  },

  textList: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
  },

  textCreate: {
    backgroundColor: '#A5FF8B',
    padding: 10,
    paddingTop: 25,
    paddingBottom: 25,
    textAlign: 'center',

  },
  textView: {
    backgroundColor: '#8BFFEA',
    padding: 10,
    paddingTop: 25,
    paddingBottom: 25,
    textAlign: 'center'

  }

});