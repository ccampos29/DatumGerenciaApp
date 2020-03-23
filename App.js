import * as React from "react";
import { Button, View, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
import MyDrawer from "./navigation/DrawerNavigation";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from 'expo';
import { navigationRef } from "./screens/RootNavigation";

// export default function App() {
//   return <DrawerNavigation />;
// }

const AuthContext = React.createContext();

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
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

        await fetch('https://api.github.com/user', {
          // method: 'GET',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': "Basic bmljb2xhc2ZvcmVyb3M6TmYxMDk0OTY4NDU5"
          }
        }).then(res => res.json())
          .then(resData => {
            if(data.email === resData.login){
              AsyncStorage.setItem('userToken', resData.login);
              alert(resData.login);
              dispatch({ type: 'SIGN_IN', token: resData.login });
            }else{
              alert("Mal usuario");
              dispatch({ type: 'SIGN_IN', token: null });
            }
          });

      },
      signOut: async () => {
        try {
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
    }),
    []
  );

  const LoginComponent = () => (<LoginScreen AuthContext={AuthContext} /> );

  const DrawerComponent = () => (<MyDrawer AuthContext={AuthContext} /> );

  return (
    <AuthContext.Provider value={authContext}>
      {state.isLoading ? (
        <AppLoading/>
      ):(
        <NavigationContainer ref={navigationRef}>
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


        {/* <Stack.Navigator>
          {state.isLoading ? (
            <AppLoading/>
            // // We haven't finished checking for the token yet
            // <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
            // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name="Drawer" component={MyDrawer} />
          )}
        </Stack.Navigator> */}
    </AuthContext.Provider>
  );
}