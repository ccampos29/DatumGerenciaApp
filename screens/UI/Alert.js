import React from 'react';
import { View, StyleSheet,Text, TouchableOpacity } from 'react-native';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Ionicons } from '@expo/vector-icons';

const Alert = props => {
    //console.log(props.visible);
    var status = props.visible;
    console.log('status');
    const [visible, setVisible] = React.useState(status);
    const cambioEstado = React.useCallback(() => {
        setVisible(!visible);
      }, [visible]);
    return (
            <FancyAlert
                visible={visible}
                icon={<View style={[styles.icon, { borderRadius: 50 }]}>
                    <Ionicons
                        name={Platform.select({ ios: 'ios-close', android: 'md-close' })}
                        size={36}
                        color="#FFFFFF"
                    />
                </View>}
                style={{ backgroundColor: 'white' }}
            >
                <View style={styles.content}>
                    {props.children}
                    {/* <Text style={styles.contentText}>{'mensajeError'}</Text> */}

                    <TouchableOpacity style={styles.btn} onPress={cambioEstado}>
                        <Text style={styles.btnText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>

            </FancyAlert>
    );
};

const styles = StyleSheet.create({
    alert: {
      backgroundColor: '#EEEEEE',
    },
    icon: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#C3272B',
      width: '100%',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -16,
      marginBottom: 16,
    },
    contentText: {
      textAlign: 'center',
    },
    btn: {
      borderRadius: 32,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 8,
      alignSelf: 'stretch',
      backgroundColor: '#C3272B',
      marginTop: 16,
      minWidth: '50%',
      paddingHorizontal: 16,
    },
    btnText: {
      color: '#FFFFFF',
    },
  });
export default Alert;
