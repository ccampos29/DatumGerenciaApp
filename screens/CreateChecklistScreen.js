import * as React from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native';
//import { Icon } from 'react-native-elements'
//import { createStackNavigator } from '@react-navigation/stack';
import { useFormik } from 'formik';
import { Button, Textarea, DatePicker, Form, Card, Item, Label, Picker, Input, Content, Container, Header, Icon, Text } from 'native-base';
//import {View, Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import { AuthContext } from './../context/AuthContext';

import AwesomeAlert from 'react-native-awesome-alerts';

export default function CreateScreen({ navigation, route }) {

  //const { spinnerOn, spinnerOff } = React.useContext(AuthContext);

  const vehicles = route.params.checklistData;

  const { values, isSubmitting, setFieldValue, handleSubmit } = useFormik({
    initialValues:
    {
      plate: '', //necesarios para el diligenciamiento de CL
      typeCheckList: '',
      driver: '',
      dateCheckList: calculateDate(),
      dateNextCheckList: '',
      time: new Date().toLocaleTimeString(),
      currentMeasurement: '',
      nextMeasurement: '',
      observation: '',
      typeCheckListEnable: false,  //no necesarios para el diligenciamiento de CL
      driverEnable: false,
      checklistTypes: new Array(),
      drivers: new Array(),

    },
    onSubmit: async (values) => {
      //console.log("Hola mundo se realizó un submit ");
      //alert(values.plate);
      // Realizar validacion
      // O validar en tiempo real, ver tutorial https://www.youtube.com/watch?v=0vx0NS-ok04
      // Falta subir el formulario para que el teclado no lo tape como en el login
      var bodyWS = {
        "Checklist": {
          "empresa_id": route.params.userToken.empresa_id, // Empresa del que ingresa o del conductor que fue seleccionado?
          "vehiculo_id": values.plate,
          "tipo_checklist_id": values.typeCheckList,
          "usuario_id": route.params.userToken.userId,
          "fecha_checklist": values.dateCheckList,
          "fecha_siguente": values.dateNextCheckList,
          "hora_medicion": values.time,
          "medicion_actual": values.currentMeasurement,
          "medicion_siguente": values.nextMeasurement,
          "observacion": values.observation,
        }
      };

      //console.log(bodyWS);

      var urlCreateCL = 'http://gerencia.datum-position.com/api/checklist/create';
      var urlGetCalif = 'http://gerencia.datum-position.com/api/checklist/calificacioneschecklist';
      var checklistInfo = {};
      await fetch(urlCreateCL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        },
        body: JSON.stringify(bodyWS)
      }).then(res => res.json())
        .then(resData => {
          console.log(resData);
          if (resData.status === "success") {
            // alert(resData.message);
            // navigation.navigate('ChecklistScreen');
            checklistInfo = resData;
            return fetch(urlGetCalif, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + route.params.userToken.token
              },
              body: JSON.stringify({ "id_checklist": resData.id_checklist, "id_vehiculo": resData.id_vehiculo, "id_tipo_checklist": resData.id_tipo_checklist })
            });
          } else {
            alert("Error en la creacion de Checklist, verifique el vehiculo y el tipo de checklist");
          }

        })
        .then(res => res.json())
        .then(resData => {
          console.log(resData);
          if (resData != null) {
            navigation.navigate("ChecklistScreen", { userToken: route.params.userToken.token, checklistGroup: resData, checklistInfo: checklistInfo, user:route.params.userToken });
          }
        })
        .catch(e => {
          console.log(e);
          alert("Error comunicandose con Datum Gerencia para crear el checklist");
        });
    },


  });

  const seleccionarVehiculo = async (value) => {
    if (value != "-1") {
      setFieldValue('plate', value);

      var parametros = new URLSearchParams({
        vehicle_id: value,
      });

      var url = 'http://gerencia.datum-position.com/api/checklist/consultamedicion?' + parametros.toString();
      console.log(url);
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          console.log(resData);
          if (resData.status === "success") {
            setFieldValue('currentMeasurement', resData.data.valor);
          } else {
            alert("Error obteniendo la medicion de odometro del vehiculo");
          }
        }).catch(e => {
          console.log("error medicion")
          alert("Error comunicandose con Datum Gerencia para odometro");
        });

      var parametrosCL = new URLSearchParams({
        vehicle_id: value, //CARLITOS QUE SEAN IGUALES LOS PARAMETROS NOS AYUDARIA POR ACA
      });
      
      var url = 'http://gerencia.datum-position.com/api/checklist/tiposchecklist?' + parametrosCL.toString();
      console.log(url);
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          console.log(resData);
          if (resData.status === "success") {
            setFieldValue('checklistTypes', resData.tipos_checklist);
            setFieldValue('typeCheckListEnable', true);
            setFieldValue('typeCheckList', '-1');
          } else {
            alert("Error obteniendo los tipos de checklist que tiene el vehiculo");
          }
        }).catch(e => {
          alert("Error comunicandose con Datum Gerencia para tipos checklist");
        });

      var parametrosCL = new URLSearchParams({
        vehicle_id: value, //CARLITOS QUE SEAN IGUALES LOS PARAMETROS NOS AYUDARIA POR ACA
      });

      var url = 'http://gerencia.datum-position.com/api/checklist/getuserbyvehicle?' + parametrosCL.toString();
      console.log(url);
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          console.log(resData);
          if (resData.length>0) {
            setFieldValue('drivers', resData);
            setFieldValue('driverEnable', true);
            setFieldValue('driver', '-1');
          } else {
            alert("Error obteniendo los conductores que tiene el vehiculo");
          }
        }).catch(e => {
          alert("Error comunicandose con Datum Gerencia para obtener conductores");
        });

    }


  }

  const seleccionarChecklist = async (checklistTypeId, currentDate, currentMeasurement) => {
    if (checklistTypeId != "-1") {
      setFieldValue('typeCheckList', checklistTypeId);

      var url = 'http://gerencia.datum-position.com/api/checklist/obtenerperiodicidadchecklist';

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        },
        body: JSON.stringify({ "id_tipo_checklist": checklistTypeId, "fecha_actual": currentDate, "odometro_actual": currentMeasurement }),
      }).then(res => res.json())
        .then(resData => {
          //console.log(resData);
          if (typeof resData.fecha_siguiente !== 'undefined') {
            setFieldValue('dateNextCheckList', resData.fecha_siguiente);
            if (typeof resData.odometro_siguiente !== 'undefined')
              setFieldValue('nextMeasurement', resData.odometro_siguiente + "");
            else
              setFieldValue('nextMeasurement', "");
          } else {
            alert("Error obteniendo la informacion despues de seleccionar checklist");
          }
        }).catch(e => {
          //console.log(e);
          alert("Error comunicandose con Datum Gerencia para odometro");
        });

    }

  }

  const seleccionarConductor = async (value) => {
    if (value != "-1") {
      setFieldValue('driver', value);
    }

  }

  return (
    <Container>
      <Content>
        <Form>
          <Card>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="car" /> <Text >  Vehiculo *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                selectedValue={values.plate}
                onValueChange={value => seleccionarVehiculo(value)}
              >
                <Picker.Item key="-1" label="Seleccione una placa" value="-1" />
                {vehicles.map((vehicle) => {
                  return (
                    <Picker.Item key={vehicle.id} label={vehicle.placa} value={vehicle.id} />
                  )
                })}
                {/* Se modifican segun lo traido del web service */}
                {/* <Picker.Item label="Seleccione una placa" value="0" />
                <Picker.Item label="MZQ03" value="1" /> */}
              </Picker>
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="tasks" /> <Text >  Tipo del Checklist *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                enabled={values.typeCheckListEnable}
                selectedValue={values.typeCheckList}
                onValueChange={value => seleccionarChecklist(value, values.dateCheckList, values.currentMeasurement)}
              >
                {/* Se modifican segun lo traido del web service */}
                <Picker.Item key="-1" label="Seleccione un checklist" value="-1" />
                {values.checklistTypes.map((checklistType) => {
                  return (
                    <Picker.Item key={checklistType.id} label={checklistType.name} value={checklistType.id} />
                  )
                })}
              </Picker>
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="user" /> <Text >  Conductor *</Text></Label>
              {/* <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={route.params.userToken.userCC + "-" + route.params.userToken.userName} onChangeText={text => setFieldValue('driver', text)} /> */}
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                enabled={values.driverEnable}
                selectedValue={values.driver}
                onValueChange={value => seleccionarConductor(value)}
              >
                {/* Se modifican segun lo traido del web service */}
                <Picker.Item key="-1" label="Seleccione un conductor" value="-1" />
                {values.drivers.map((driver) => {
                  return (
                    <Picker.Item key={driver.id_number+"-"+driver.name+" "+driver.surname} label={driver.id_number+" - "+driver.name+" "+driver.surname} value={driver.id_number+"-"+driver.name+" "+driver.surname} />
                  )
                })}
              </Picker>
            </Item>
          </Card>
          <Card style={styles.CardDisable}>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del checklist *</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleDateString()}</Text> */}
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.dateCheckList} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del siguiente checklist</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.dateNextCheckList} onChangeText={text => setFieldValue('dateNextCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-clock" /> <Text >  Hora del checklist *</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleTimeString()}</Text> */}
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.time} onChangeText={text => setFieldValue('time', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="plus" /> <Text >  Medición actual*</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleDateString()}</Text> */}
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.currentMeasurement} onChangeText={text => setFieldValue('currentMeasurement', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="plus" /> <Text >  Medición del siguiente checklist</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.nextMeasurement} onChangeText={text => setFieldValue('nextMeasurement', text)} />
            </Item>
          </Card>
          <Card>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-text" /> <Text >  Observaciones</Text></Label>
              <Textarea style={{ width: 300, marginBottom: 10 }} rowSpan={5} bordered value={values.observation} onChangeText={text => setFieldValue('observation', text)} />
            </Item>
          </Card>
          <Card>
            <TouchableOpacity
              style={{
                backgroundColor: "#B98105",
                borderRadius: 6,
                marginBottom: 20,
              }}
              onPress={handleSubmit}
            //onPress={()=>cargarChecklist(values)}
            >
              <Text style={styles.textButton}>Crear</Text>
            </TouchableOpacity>
          </Card>
        </Form>
      </Content>
    </Container>
  );
}

function calculateDate() {
  var today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  let fullDate = year + '-' + month + '-' + day;
  return fullDate;

}

const styles = StyleSheet.create({
  MenuStyle: {
    margin: 20
  },
  Item: {
    padding: 10
  },
  Input: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 3,
    marginRight: 3,
    marginTop: 8,
    backgroundColor: '#E7E7E7'

  },
  Select: {
    width: 340,
    margin: 10,
    color: '#5e5e5e'
  },
  SelectDisable: {
    width: 340,
    margin: 10,
    color: '#C0BEBE'
  },
  LabelIcon: {
    color: '#B98105'
  },
  CardDisable: {
    backgroundColor: '#F7F7F7',
    paddingBottom: 4,

  },
  textButton: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 20,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 130


  }

});