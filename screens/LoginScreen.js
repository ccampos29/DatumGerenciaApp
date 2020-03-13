import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, ScrollView } from 'react-native';
import TextInput from 'react-native-textinput-with-icons'
import { CheckBox } from 'react-native-elements'
import Card from './UI/Card';

export default function LoginScreen({ navigation }){

    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.screen}
            enabled
        >
            <ImageBackground source={require('./../assets/background.jpg')} style={styles.background}>
                <Card style={styles.authHeader}>
                    <Text style={ styles.textHeader }>INICIAR SESIÓN</Text>
                </Card>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <TextInput
                            label="Correo electronico"
                            leftIcon="envelope"
                            leftIconType="awesome"
                            labelActiveColor='#fed501'
                            underlineActiveColor='#fed501'
                        />
                        <TextInput
                            label="Contraseña"
                            leftIcon="lock"
                            leftIconType="awesome"
                            labelActiveColor='#fed501'
                            underlineActiveColor='#fed501'
                            secureTextEntry={true}
                        />
                        <CheckBox
                            title='Conservar la sesión'
                            containerStyle={{backgroundColor:'white', borderColor:'white', marginLeft:"-3%"}}
                            textStyle={{fontWeight:'normal'}}
                        />
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity 
                                style={{backgroundColor:"#fed501", borderRadius:6, width: 100}}
                                onPress={()=>navigation.navigate('DrawerNavigation')} >
                                <Text style = {styles.textButton}>
                                    Ingresar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Card>
            </ImageBackground>
        </KeyboardAvoidingView>
    );  
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    background: {
        flex: 1,
        width: '100%', 
        height: '102%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    authContainer: {
        width: '90%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20,
        paddingTop: 30,
        marginTop: -20
    },
    authHeader: {
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fed501',
        width: '75%', 
        height: 45,
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
    textHeader: {
        color: "#FFFFFF", 
        fontWeight: 'bold', 
        fontSize: 18
    },
    textButton: {
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        color: "#FFFFFF",
        fontSize:16
    }
});