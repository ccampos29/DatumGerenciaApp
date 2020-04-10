import * as React from "react";
import { Button, View, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
import MyDrawer from "./navigation/DrawerNavigation";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from 'expo';
import { navigationRef } from "./screens/RootNavigation";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from './context/AuthContext';
import * as Font from 'expo-font';

const Stack = createStackNavigator();

export default function App({ navigation }) {

  var loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    });
  }

  loadFonts();

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SPINNER_ON':
          return {
            ...prevState,
            spinner:true,
          };
        case 'SPINNER_OFF':
        return {
          ...prevState,
          spinner:false,
        };
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            spinner:false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            spinner:false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            spinner:false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        dispatch({ type: 'SPINNER_ON' });
        await fetch('http://192.168.1.57:80/datum_gerencia-master/datum_gerencia-master/frontend/web/index.php/Api/user/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "username": data.email, "password": data.password })
        }).then(res => res.json())
          .then(resData => {
            var userToken = {};

            if(resData.token!=null){
              userToken.token = resData.token;
              userToken.userId = resData.user.id;
              userToken.userCC = resData.user.id_number;
              userToken.userName = resData.user.name;
              userToken.userEmail = resData.user.email;
              userToken.userTypeId = resData.user.tipo_usuario_id;
              userToken.userCompanyId = resData.user.empresa_id;
              
              var token2Store = JSON.stringify(userToken);
              AsyncStorage.setItem('userToken', token2Store);
              dispatch({ type: 'SIGN_IN', token: token2Store });
            }else{
              dispatch({ type: 'SIGN_IN', token: null });
              alert("Mal usuario");
            }

            // if(data.email === resData.login){
            //   AsyncStorage.setItem('userToken', resData.login);
            //   dispatch({ type: 'SIGN_IN', token: resData.login });
            // }else{
            //   dispatch({ type: 'SIGN_IN', token: null });
            //   alert("Mal usuario");
            // }
          }).catch(e=>{
            console.log("Hay un error!, " + e);
            dispatch({ type: 'SPINNER_OFF' });
          });

      },
      signOut: async () => {

        dispatch({ type: 'SPINNER_ON' });

        try {
          //limpiar toda
          await AsyncStorage.removeItem('userToken');
        } catch(e) {
          console.log("error removiendo el token");
        }
        
        dispatch({ type: 'SIGN_OUT', token:null });
      
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      spinnerOn: () => {
        dispatch({ type: 'SPINNER_ON'});
      },
      spinnerOff: () => {
        dispatch({ type: 'SPINNER_OFF'});
      },
    }),
    []
  );

  const LoginComponent = () => (<LoginScreen /> );

  const DrawerComponent = () => (<MyDrawer properties={{ "userToken":state.userToken }}/> );

  return (
    <AuthContext.Provider value={authContext}>
      {state.isLoading ? (
        <AppLoading/>
      ):(
        <NavigationContainer ref={navigationRef}>
          <Spinner
            visible={state.spinner}
            textContent={'Cargando...'}
            textStyle={{ color: '#FFF' }}
          />
          <Stack.Navigator headerMode='none'>
            {state.userToken == null ? (
              // No token found, user isn't signed in
              <Stack.Screen
                name="Login"
                component={LoginComponent}
                options={{
                // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push'
                }}
              />
            ) : (
              // User is signed in
              <Stack.Screen name="Drawer" component={DrawerComponent} />
            )}
          </Stack.Navigator>
          
        </NavigationContainer>
        )}
    </AuthContext.Provider>
  );
}