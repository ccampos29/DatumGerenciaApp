import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground, Modal, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList } from 'react-native-gesture-handler';
import CreateChecklist from './CreateChecklistScreen';
//import { AuthContext } from './../context/AuthContext';
import ChecklistScreen from './ChecklistScreen';
import CreateFuel from './CreateFuelScreen';

import { useFormik } from 'formik';
import Alert from "./UI/Alert";


function Home({ navigation, route }) {
  const data = [
    { key: '1', label: 'CHECKLIST', crear: 'CREAR', ver: 'VER', image: require('./../assets/checklist.png') },
    { key: '2', label: 'COMBUSTIBLES', crear: 'CREAR', ver: 'VER', image: require('./../assets/combustible.png') },
    // { key: 3, label: 'OTROS GASTOS', crear: 'CREAR', ver: 'VER', image: require('./../assets/otrosGastos.png') },
    // { key: 4, label: 'NOVEDADES', crear: 'CREAR', ver: 'VER', image: require('./../assets/novedades.png') },
  ];

  // const { spinnerOn } = React.useContext(AuthContext);
  // const { spinnerOff } = React.useContext(AuthContext);

  const { values, setFieldValue } = useFormik({
    initialValues:
    {
      carga: false,
      visibleError: false,
      errorMsg: '',

    },
    onSubmit: async (values) => {

    }
  });


  const open = async (item) => {
    if (item.key === '1') {
      //spinnerOn();
      setFieldValue('carga', true);
      var parametros = new URLSearchParams({
        user_id: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
        //user_id: 18,
      });

      var url = 'https://gerencia.datum-position.com/api/checklist/getvehiclebyuser?' + parametros.toString();

      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          //console.log(resData);
          if (resData.status === "success") {
            //console.log("////////////////////////////////////////////////");
            //spinnerOff();
            setFieldValue('carga', false);
            navigation.navigate("CreateChecklist", { userToken: route.params.userToken, checklistData: resData.vehiculos });
          } else {
            //spinnerOff();
            setFieldValue('carga', false);
            setFieldValue('errorMsg', 'Error autenticando el usuario para la creación de checklist');
            setFieldValue('visibleError', true);
            setTimeout(() => {
              setFieldValue('visibleError', false);
            }, 3000);
            //showError("Error autenticando el usuario para la creación de checklist")
            //alert("Error autenticando el usuario para la creación de checklist");
          }
        }).catch(e => {
          //alert("Error comunicandose con Datum Gerencia");
          //spinnerOff();
          //console.log('hola')
          setFieldValue('carga', false);
          setFieldValue('errorMsg', 'Error comunicandose con Datum Gerencia');
          setFieldValue('visibleError', true);
          setTimeout(() => {
            setFieldValue('visibleError', false);
          }, 3000);
        });
    }

    if (item.key === '2') {
      //spinnerOn();
      setFieldValue('carga', true);
      var parameters = new URLSearchParams({
        id_user: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
        id_empresa: route.params.userToken.userCompanyId,
        //id_user: 18,
      });
      var parametros = new URLSearchParams({
        user_id: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
        //user_id: 18,
      });

      var urlFuel = 'https://gerencia.datum-position.com/api/combustible/createcombustible?' + parameters.toString();
      var urlVehicle = 'https://gerencia.datum-position.com/api/checklist/getvehiclebyuser?' + parametros.toString();
      // console.log(urlFuel);
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
          //console.log(resData);
          if (typeof resData.centrosCostos !== 'undefined') {
            fuelData = resData;
            return fetch(urlVehicle, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + route.params.userToken.token
              }
            });

            //navigation.navigate("CreateFuel", { userToken: route.params.userToken, fuelData: resData });
          }
        }).then(res => res.json())
        .then(resData => {

          if (resData.status === "success") {
            vehicleData = resData.vehiculos;
            return fetch('https://gerencia.datum-position.com/pais/pais-list', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
          }
        }).then(res => res.json())
        .then(resData => {
          //console.log(resData);
          if (typeof resData !== 'undefined') {
            //spinnerOff();
            setFieldValue('carga', false);
            navigation.navigate("CreateFuel", { userToken: route.params.userToken, fuelData: fuelData, vehicleData: vehicleData, countryData: resData, user: route.params.userToken });
          } else {
            //spinnerOff();
            setFieldValue('carga', false);
            setFieldValue('errorMsg', 'Error autenticando el usuario para la creación de checklist');
            setFieldValue('visibleError', true);
            setTimeout(() => {
              setFieldValue('visibleError', false);
            }, 3000);
            //alert("Error autenticando el usuario para la creación de checklist");
          }
        }).catch(e => {
          //console.log(e);
          setFieldValue('carga', false);
          setFieldValue('errorMsg', 'Error comunicandose con Datum Gerencia');
          setFieldValue('visibleError', true);
          setTimeout(() => {
            setFieldValue('visibleError', false);
          }, 3000);
          //alert("Error comunicandose con Datum Gerencia");
          //spinnerOff();
        });
    }

  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={values.carga}
      >
        <ActivityIndicator style={styles.activityIndicator} animating={values.carga} size="large" color="#E0A729" />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={values.visibleError}
        onPress={() => { console.log("auuchh") }}
        style={{ width: 300, height: 600 }}
      >
        <Alert message={values.errorMsg} visible={values.visibleError}></Alert>
      </Modal>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => open(item)}>
            <ImageBackground source={item.image} style={styles.elementList}>
              <Text style={styles.textList}>{item.label}</Text>
            </ImageBackground>
          </TouchableOpacity>

        )}
      />
    </View>
  );
}

// async function _onPress(item, navigation, route, spinnerOn, spinnerOff, showError) {
//   //Autenticar el usuario
//   if (item.key === '1') {
//     spinnerOn();

//     var parametros = new URLSearchParams({
//       user_id: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
//       //user_id: 18,
//     });

//     var url = 'https://gerencia.datum-position.com/api/checklist/getvehiclebyusr?' + parametros.toString();

//     await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + route.params.userToken.token
//       }
//     }).then(res => res.json())
//       .then(resData => {
//         console.log(resData);
//         if (resData.status === "success") {
//           console.log("////////////////////////////////////////////////");
//           spinnerOff();
//           navigation.navigate("CreateChecklist", { userToken: route.params.userToken, checklistData: resData.vehiculos });
//         } else {
//           spinnerOff();
//           showError("Error autenticando el usuario para la creación de checklist")
//           //alert("Error autenticando el usuario para la creación de checklist");
//         }
//       }).catch(e => {
//         console.log(e);
//         showError("Error comunicandose con Datum Gerencia");
//         //alert("Error comunicandose con Datum Gerencia");
//         spinnerOff();

//       });
//   }

//   if (item.key === '2') {
//     spinnerOn();

//     var parameters = new URLSearchParams({
//       id_user: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
//       id_empresa: route.params.userToken.userCompanyId,
//       //id_user: 18,
//     });
//     var parametros = new URLSearchParams({
//       user_id: route.params.userToken.userId, //ESTA DEBERIA SER LA OPCION VERDADERA
//       //user_id: 18,
//     });

//     var urlFuel = 'https://gerencia.datum-position.com/api/combustible/createcombustible?' + parameters.toString();
//     var urlVehicle = 'https://gerencia.datum-position.com/api/checklist/getvehiclebyuser?' + parametros.toString();
//     console.log(urlFuel);
//     var fuelData;
//     var vehicleData;
//     await fetch(urlFuel, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + route.params.userToken.token
//       }
//     }).then(res => res.json())
//       .then(resData => {
//         console.log(resData);
//         if (typeof resData.centrosCostos !== 'undefined') {
//           fuelData = resData;
//           return fetch(urlVehicle, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': 'Bearer ' + route.params.userToken.token
//             }
//           });

//           //navigation.navigate("CreateFuel", { userToken: route.params.userToken, fuelData: resData });
//         }
//       }).then(res => res.json())
//       .then(resData => {

//         if (resData.status === "success") {
//           vehicleData = resData.vehiculos;
//           return fetch('https://gerencia.datum-position.com/pais/pais-list', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           });
//         }
//       }).then(res => res.json())
//       .then(resData => {
//         //console.log(resData);
//         if (typeof resData !== 'undefined') {
//           spinnerOff();
//           navigation.navigate("CreateFuel", { userToken: route.params.userToken, fuelData: fuelData, vehicleData: vehicleData, countryData: resData, user: route.params.userToken });
//         } else {
//           spinnerOff();
//           alert("Error autenticando el usuario para la creación de checklist");
//         }
//       }).catch(e => {
//         console.log(e);
//         alert("Error comunicandose con Datum Gerencia");
//         spinnerOff();
//       });
//   }
// }

const Stack = createStackNavigator();

export default function HomeScreen(props) {

  return (
    <Stack.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E0A729',
          height: Platform.OS === 'ios' ? 85 : 85
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

  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'rgba(234, 234, 234, 0.4)',
  }

});