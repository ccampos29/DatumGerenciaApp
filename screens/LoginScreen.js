import * as React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ImageBackground } from 'react-native';
import TextInput from 'react-native-textinput-with-icons'

import { LinearGradient } from 'expo-linear-gradient';


export default function LoginScreen(){

    return (
        <ImageBackground source={require('./../assets/background.jpg')} style={{width: '100%', height: '100%'}}>
            <View style={styles.Container}>
                <View style={styles.ContainerHeader}>
                    <Text style={ styles.TextHeader }>INICIAR SESIÓN</Text>
                </View>
                <View style={styles.ContainerForm}>

                <View style={{marginTop:25, alignItems: 'center'}}>
                    <TextInput
                        label="Nombre de usuario"
                        leftIcon="user"
                        leftIconType="awesome"
                        containerMaxWidth='88%'
                    />
                    <TextInput
                        label="Email"
                        leftIcon="envelope"
                        leftIconType="awesome"
                        containerMaxWidth='88%'
                    />
                </View>
                
                <View style={{marginTop:10}}>
                    <TouchableOpacity>
                        <Text style = {styles.text}>
                        INICIAR
                        </Text>
                    </TouchableOpacity>
                </View>


                </View>
            </View>
        </ImageBackground>
    );  
}

const styles = StyleSheet.create({
    GradientBackground: {
        flex: 1,
        zIndex:-1
    },
    Container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    ContainerHeader: {
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '80%', 
        height: '7%',
        backgroundColor: "#fed501", 
        borderRadius: 6,
        zIndex:1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    TextHeader: {
        color: "#FFFFFF", 
        fontWeight: 'bold', 
        fontSize: 18
    },
    ContainerForm: {
        marginTop: -30,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: "#FFFFFF", 
        width: '90%', 
        height: '30%',
        borderRadius: 12,
        padding: 10
    },
    text: {
        padding: 10,
        color: "#fed501",
        fontWeight: 'bold',
        fontSize:18
     }
});