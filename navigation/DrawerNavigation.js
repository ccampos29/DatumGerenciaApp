import * as React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerItemList
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";

import { navigationRef } from "./../screens/RootNavigation";
import HomeScreen from "./../screens/HomeScreen";
import AboutScreen from "./../screens/AboutScreen";
import LoginScreen from "./../screens/LoginScreen";
import * as RootNavigation from './../screens/RootNavigation'

function DrawerMenu(props) {
  return (
    <TouchableOpacity onPress={props.navigation}>
      <View style={styles.menuContainer}>
        <View style={styles.iconoContainer}>
          <Icon size={17} name={props.iconName} />
        </View>
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTxt}>{props.titleName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Menu(props) {
  return (
    <View style={styles.container}>
      <View style={styles.bgContainer}>
        <TouchableOpacity>
          <View style={styles.userContainer}>
            <Image
              style={styles.userImagen}
              source={require("./../assets/icon.png")}
            />
          </View>
          <View style={styles.userNombre}>
            <Text style={styles.userTitulo}>Datum Position</Text>
            <Text style={styles.userSubTitulo}>nombre de usuario</Text>
          </View>
        </TouchableOpacity>
      </View>
      <DrawerMenu
        iconName="home"
        titleName="Home"
        navigation={() => props.navigation.dispatch(
                            CommonActions.reset({
                              index: 1,
                              routes: [
                                { name: 'Login' },
                                { name: 'Home' },
                                { name: 'About' }
                              ],
                            })
                          )}
        // navigation={() => props.navigation.navigate("Home")}
      />
      <DrawerMenu
        iconName="info-circle"
        titleName="About"
        navigation={() => props.navigation.navigate("About")}
      />
      <DrawerMenu
        iconName="arrow-left"
        titleName="Logout"
        navigation={() => RootNavigation.navigate("Login")}
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator drawerContent={props => <Menu {...props} />}>
        <Drawer.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: false }} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
export default MyDrawer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },

  bgContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#A0A0A0"
  },

  userContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },

  userImagen: {
    width: 70,
    height: 70,
    borderRadius: 35
  },

  camaraContainer: {
    justifyContent: "center",
    alignItems: "center"
  },

  camaraIcon: {
    width: 20,
    height: 20,
    position: "absolute",
    left: 15,
    bottom: 3
  },

  userNombre: {
    marginVertical: 10
  },

  userTitulo: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },

  userSubTitulo: {
    textAlign: "center",
    fontSize: 11,
    color: "#E0A729",
    paddingVertical: 5
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 10,
    marginVertical: 15
  },

  iconoContainer: {
    flex: 1.5,
    justifyContent: "center"
  },

  tituloContainer: {
    flex: 8.5,
    justifyContent: "center"
  },

  tituloTxt: {
    fontSize: 13
  },
  difuminado: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  fondoImagen: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
});