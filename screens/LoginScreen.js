import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  AsyncStorage
} from "react-native";
import TextInput from "react-native-textinput-with-icons";
import { CheckBox } from "react-native-elements";
import { url } from "../src/constants/Urls"
import Card from "./UI/Card";
import * as RootNavigation from './RootNavigation';
import api from "../src/Services/Api"


export default function LoginScreen({AuthContext}) {
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  // var login = async () => {
  //   alert(email + " "+ password);
  //   await fetch('https://www.hardeepcoder.site/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ "email": email, "password": password })
  //   }).then(res => res.json())
  //     .then(resData => {
  //       alert(resData.message);
  //       // Aca se almacena la sesión con el token en el AsyncStorage 
  //       // Con los metodos getItem('authentication_data'); y setItem('authentication_data');
  //       // Abajo comentado aparece como validar si la sesión está activa, es otro llamado asincrono
  //       // acá hay mas documentacion sobre manejo de sesiones con RN
  //       // https://medium.com/@rossbulat/react-native-user-authentication-flow-explained-d988905ba106
  //       // https://www.youtube.com/watch?v=XME68dWpKyc 
  //     });
  // }

  // var login2 = async () => {
  //   await fetch('https://api.github.com/user', {
  //     // method: 'GET',
  //     headers: {
  //       'Accept': 'application/vnd.github.v3+json',
  //       'Authorization': "Basic bmljb2xhc2ZvcmVyb3M6TmYxMDk0OTY4NDU5"
  //     }
  //   }).then(res => res.json())
  //     .then(resData => {
  //       if(email === resData.login){
  //         AsyncStorage.setItem('userToken', resData.login);
  //         alert(resData.login);
  //         navigation.navigate("Home");
  //       }else{
  //         alert("Mal usuario");
  //       }
  //     });
  // }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen} enabled>
      <ImageBackground
        source={require("./../assets/background.jpg")}
        style={styles.background}
      >
        <Card style={styles.authHeader}>
          <Text style={styles.textHeader}>INICIAR SESIÓN</Text>
        </Card>
        <Card style={styles.authContainer}>
          <ScrollView>
            <TextInput
              label="Correo electronico"
              leftIcon="envelope"
              leftIconType="awesome"
              labelActiveColor="#fed501"
              underlineActiveColor="#fed501"
              autoCapitalize="none"

              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              label="Contraseña"
              leftIcon="lock"
              leftIconType="awesome"
              labelActiveColor="#fed501"
              underlineActiveColor="#fed501"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <CheckBox
              title="Conservar la sesión"
              containerStyle={{
                backgroundColor: "white",
                borderColor: "white",
                marginLeft: "-3%"
              }}
              textStyle={{ fontWeight: "normal" }}
            />
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fed501",
                  borderRadius: 6,
                  width: 100
                }}
                //onPress={() => RootNavigation.navigate("Home")}
                //onPress ={() => alert(password)}
                //onPress={login2}
                onPress={() => signIn({ email:email, password:password })}
              >
                <Text style={styles.textButton}>Ingresar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

////////////////////////////////////////////////////////////////////////////////
////////////// Manejo de sesiones //////////////////////////////////////////////

// initAuthToken = async () => {
//   const authData = await AsyncStorage.getItem('authentication_data');

//   if (authData !== null) {
//     const authDataJson = JSON.parse(authData);

//     // get user data url api
//     fetch(consts.API_URL + '/users/populate-settings', {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         authToken: authData.authToken,
//         deviceId: authData.deviceId
//       }),
//       method: "POST"
//     })
//       .then(res => res.json())
//       .then(data => {

//         if (data.ack === 'success') {
//           this.populateUserSettings(data.response);
//         } else {
//           this.props.navigation.navigate("SignIn");
//         }
//       })
//       .catch(e => {
//         this.setState({
//           error: true
//         });
//       });

//   } else {
//     this.props.navigation.navigate("SignIn");
//   }
// }


// componentDidUpdate() {
//   if(this.props.userSettings !== undefined) {
//     this.props.navigate("Home");
//   }
// }

// componentDidMount() {  
//   this.initAuthToken();
// }


////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  background: {
    flex: 1,
    width: "100%",
    height: "102%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  },
  authContainer: {
    width: "90%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
    paddingTop: 30,
    marginTop: -20
  },
  authHeader: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fed501",
    width: "75%",
    height: 45,
    borderRadius: 6,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  },
  textHeader: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18
  },
  textButton: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#FFFFFF",
    fontSize: 16
  }
});
