import React from 'react';
import { View, StyleSheet,Text, TouchableOpacity } from 'react-native';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Ionicons } from '@expo/vector-icons';

const AlertSuccess = props => {
    const [visible, setVisible] = React.useState(props.visible);
    const cambioEstado = React.useCallback(() => {
        setVisible(!visible);
      }, [visible]);
    return (
            <FancyAlert
                visible={visible}
                icon={<View style={[styles.icon, { borderRadius: 50 }]}>
                    <Ionicons
                        name={Platform.select({ ios: 'ios-checkmark', android: 'md-checkmark' })}
                        size={36}
                        color="#FFFFFF"
                    />
                </View>}
                style={{ backgroundColor: 'white' }}
            >
                <View style={styles.content}>

                    <Text style={styles.contentText}>{props.mensaje}</Text>

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
      backgroundColor: '#2B9E00',
      width: '100%',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -16,
      marginBottom: 16,
      paddingStart: 5,
    },
    contentText: {
      //textAlign: 'center',
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
      backgroundColor: '#2B9E00',
      marginTop: 16,
      minWidth: '50%',
      paddingHorizontal: 16,
    },
    btnText: {
      color: '#FFFFFF',
    },
  });
export default AlertSuccess;
