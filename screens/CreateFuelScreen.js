import * as React from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity, Image, Platform } from 'react-native';
//import { Icon } from 'react-native-elements'
//import { createStackNavigator } from '@react-navigation/stack';
import { useFormik } from 'formik';
import { Button, Textarea, Form, Card, Item, Label, Picker, Input, Content, Container, Header, Icon, Text } from 'native-base';
//import {View, Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { View } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateFuelScreen({ navigation, route }) {
  // console.log(route.params.fuelData);
  //console.log(route.params.countryData);

  const vehicleList = route.params.vehicleData;
  const costsCenterList = route.params.fuelData.centrosCostos;
  const fuelTypeList = route.params.fuelData.combustibles;
  const associatedGroupList = route.params.fuelData.grupoVehiculos;
  const providerList = route.params.fuelData.proveedores;
  const countryList = route.params.countryData.results;

  const { values, isSubmitting, setFieldValue, handleSubmit } = useFormik({
    initialValues:
    {
      date: calculateDate(new Date()), //necesarios para el diligenciamiento de CL
      time: new Date().toLocaleTimeString(),
      full: '',
      cost: '',
      quantity: '',
      provider: '',
      ticketNumber: '',
      vehicle: '',
      fuelType: '',
      chargeTo: route.params.userToken.userId,
      associatedGroup: '',
      userMeasurement: '0',
      measurement: '',
      costsCenter: '',
      country: '',
      department: '',
      city: '',
      observation: '',
      imageSource: '',

      departmentList: new Array(),
      cityList: new Array(),
    },
    onSubmit: (values) => {
      //console.log("Se hizo submit con: ");
      //console.log(values);

      var bodyWS={"Combustibles":
                    {
                      "fecha":values.date,
                      "hora":values.time,
                      "tanqueo_full":values.full,
                      "costo_por_galon":values.cost,
                      "cantidad_combustible":values.quantity,
                      "proveedor_id":values.provider,
                      "numero_tiquete":values.ticketNumber,
                      "vehiculo_id":values.vehicle,
                      "tipo_combustible_id":values.fuelType,
                      "usuario_id":values.chargeTo,
                      "grupo_vehiculo_id":values.associatedGroup,
                      "medicion_actual":values.userMeasurement, //el que digita el usuario
                      "medicion_compare":values.measurement, //el del webservice
                      "centro_costo_id":values.costsCenter,
                      "pais_id":values.country,
                      "departamento_id":values.department,
                      "municipio_id":values.city,
                      "observacion":values.observation,
                      "imagenCombustible":values.imageSource
                    }
      };

      //console.log(bodyWS);

      var parameters = new URLSearchParams({
        id_empresa: route.params.userToken.userCompanyId,
        id_user: route.params.userToken.userId,
      });

      var urlStore = 'http://192.168.1.55:80/datum_gerencia-master/datum_gerencia-master/frontend/web/index.php/Api/combustible/storecombustible?'+parameters.toString();
      fetch(urlStore, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + route.params.userToken.token
            },
            body: JSON.stringify(bodyWS)
          }).then(res => res.json())
            .then(resData => {
              //console.log(resData);
              if(resData.status==="success"){
                var prueba = resData.message;
                alert(prueba);
                navigation.navigate('Home');
                
              }else{
                alert("Error en la creacion de Combustible, verifique el formulario");
              }

            })
            .catch(e=>{
              console.log(e.message);
              alert("Error comunicandose con Datum Gerencia para crear el combustible");
            });

    },
  });

  const seleccionarVehiculo = async (value) => {
    if(value!="-1"){
      setFieldValue('vehicle', value);

      var parametros = new URLSearchParams({
        idVehiculo: value,
      });
    
      var url = 'http://192.168.1.62:80/datum_gerencia-master/frontend/web/index.php/Api/checklist/consultamedicion?' + parametros.toString();
    
      await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + route.params.userToken.token
            }
          }).then(res => res.json())
            .then(resData => {
    
              if(resData.status==="success"){
                setFieldValue('measurement',resData.data.valor);
              }else{
                alert("Error obteniendo la medicion de odometro del vehiculo");
              }
            }).catch(e=>{
              alert("Error comunicandose con Datum Gerencia para odometro");
            });
    }
  }

  const seleccionarPais = async (value) => {
    if(value!="-1"){
      setFieldValue('country', value);

      var parametros = new URLSearchParams({
        id_pais: value,
      });
    
      var url = 'http://192.168.1.62:80/datum_gerencia-master/frontend/web/index.php/Api/combustible/getdepartamentos?' + parametros.toString();
    
      await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + route.params.userToken.token
            }
          }).then(res => res.json())
            .then(resData => {
              if(resData.length>0){
                setFieldValue('departmentList',resData);
              }else{
                alert("El pais no tiene departamentos");
              }
            }).catch(e=>{
              alert("Error comunicandose con Datum Gerencia para sleccionar un pais");
            });
    }
  }

  const seleccionarDepartamento = async (value) => {
    if(value!="-1"){
      setFieldValue('department', value);

      var parametros = new URLSearchParams({
        id_departamento: value,
      });
    
      var url = 'http://192.168.1.62:80/datum_gerencia-master/frontend/web/index.php/Api/combustible/getmunicipios?' + parametros.toString();
    
      await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + route.params.userToken.token
            }
          }).then(res => res.json())
            .then(resData => {
              if(resData.length>0){
                setFieldValue('cityList',resData);
              }else{
                alert("El departamento no tiene ciudades");
              }
            }).catch(e=>{
              alert("Error comunicandose con Datum Gerencia para seleccionar un departamento");
            });
    }
  }

  //setSelectedImage({ localUri: './../assets/add3.png' });
  let [selectedImage, setSelectedImage] = React.useState(null);
  let [selectedDate, setSelectedDate] = React.useState(new Date(values.date));
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
    console.log(pickerResult.uri);

  };

  let openImagePickerCamAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });;
    console.log(pickerResult.uri);

  };

  const seleccionarFechaHora = (event, selecDate) => {
    const currentDate = selecDate || selectedDate;
    setShow(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    if(mode==='date'){
      setFieldValue('date', calculateDate(currentDate));
    }else{
      if(mode==='time'){
        setFieldValue('time', currentDate.toLocaleTimeString());
      }
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

return (
  <Container>
    <Content>
      <Form>
        <Card style={styles.CardDisable}>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del tanqueo *</Text></Label>
            <TouchableOpacity onPress={showDatepicker}>
              <View style={{ height:70, width:375 }}>
                <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.date} />  
              </View>
            </TouchableOpacity>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} name="ios-clock" /> <Text >  Hora del tanqueo *</Text></Label>
            <TouchableOpacity onPress={showTimepicker}>
              <View style={{ height:70, width:375 }}>
                <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.time} />
              </View>
            </TouchableOpacity>
          </Item>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={selectedDate}
              mode={mode}
              is24Hour={true}
              display="default"
              maximumDate={new Date()}
              onChange={seleccionarFechaHora}
            />
          )}

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="gas-pump" /> <Text >  Tanqueo Full *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.full}
              onValueChange={value => setFieldValue('full', value)}
            >
              <Picker.Item key="-1" label="Seleccione una opcion..." value="-1" />
              <Picker.Item key="Si" label="Si" value="1" />
              <Picker.Item key="Si" label="No" value="0" />
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="dollar-sign" /> <Text >  Costo por Galon *</Text></Label>
            <Input style={styles.Input} editable={true} selectTextOnFocus={false} value={values.cost} onChangeText={text => setFieldValue('cost', text)} />
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="hashtag" /> <Text >  Cantidad de Combustible *</Text></Label>
            <Input style={styles.Input} editable={true} selectTextOnFocus={false} value={values.quantity} onChangeText={text => setFieldValue('quantity', text)} />
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="gas-pump" /> <Text >  Proveedor *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.provider}
              onValueChange={value => setFieldValue('provider',value)}
            >
              <Picker.Item key="-1" label="Seleccione un proveedor..." value="-1" />
              {providerList.map((provider) => {
                    return (
                        <Picker.Item key={provider.id} label={provider.name} value={provider.id} />
                    )
                })}
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="hashtag" /> <Text >  Numero del tiquete</Text></Label>
            <Input style={styles.Input} editable={true} selectTextOnFocus={false} value={values.ticketNumber} onChangeText={text => setFieldValue('ticketNumber', text)} />
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="car" /> <Text >  Vehiculo *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.vehicle}
              onValueChange={value => seleccionarVehiculo(value)}
            >
              <Picker.Item key="-1" label="Seleccione un vehiculo..." value="-1" />
              {vehicleList.map((vehicle) => {
                    return (
                        <Picker.Item key={vehicle.id} label={vehicle.placa} value={vehicle.id} />
                    )
                })}
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="list" /> <Text >  Tipo de Combustible *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.fuelType}
              onValueChange={value => setFieldValue('fuelType', value)}
            >
              <Picker.Item key="-1" label="Seleccione un tipo..." value="-1" />
              {fuelTypeList.map((type) => {
                    return (
                        <Picker.Item key={type.id} label={type.nombre} value={type.id} />
                    )
                })}
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="user" /> <Text >  Cargar a *</Text></Label>
            <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={route.params.userToken.userCC + "-" + route.params.userToken.userName} onChangeText={text => setFieldValue('driver', text)} />
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="users" /> <Text >  Grupo Asociado *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.associatedGroup}
              onValueChange={value => setFieldValue('associatedGroup', value)}
            >
              <Picker.Item key="-1" label="Seleccione un grupo..." value="-1" />
              {associatedGroupList.map((group) => {
                    return (
                        <Picker.Item key={group.id} label={group.text} value={group.id} />
                    )
                })}
            </Picker>
          </Item>
          
          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="plus" /> <Text >  Medición *</Text></Label>
            <Input style={styles.Input} editable={true} selectTextOnFocus={false} value={values.userMeasurement} onChangeText={text => setFieldValue('userMeasurement', text)} />
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="plus" /> <Text >  Medición Web Service *</Text></Label>
            <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.measurement} onChangeText={text => setFieldValue('measurement', text)} />
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="map" /> <Text >  Centro de Costos *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.costsCenter}
              onValueChange={value => setFieldValue('costsCenter', value)}
            >
              <Picker.Item key="-1" label="Seleccione un centro..." value="-1" />
              {costsCenterList.map((center) => {
                    return (
                        <Picker.Item key={center.id} label={center.name} value={center.id} />
                    )
                })}
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="map" /> <Text >  Pais *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.country}
              onValueChange={value => seleccionarPais(value)}
            >
              <Picker.Item key="-1" label="Seleccione un pais..." value="-1" />
              {countryList.map((country) => {
                    return (
                        <Picker.Item key={country.id} label={country.text} value={country.id} />
                    )
                })}
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="map-pin" /> <Text >  Departamento *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.department}
              onValueChange={value => seleccionarDepartamento(value)}
            >
              <Picker.Item key="-1" label="Seleccione un departamento..." value="-1" />
              {values.departmentList.map((department) => {
                    return (
                        <Picker.Item key={department.id} label={department.name} value={department.id} />
                    )
                })}
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="map-pin" /> <Text >  Ciudad *</Text></Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={styles.Select}
              enabled={true}
              selectedValue={values.city}
              onValueChange={value => setFieldValue('city', value)}
            >
              <Picker.Item key="-1" label="Seleccione una ciudad..." value="-1" />
              {values.cityList.map((city) => {
                    return (
                        <Picker.Item key={city.id} label={city.name} value={city.id} />
                    )
                })}
            </Picker>
          </Item>

          <Item stackedLabel style={styles.Item}>
            <Label> <Icon style={styles.LabelIcon} name="ios-text" /> <Text >  Observaciones</Text></Label>
            <Textarea style={{ width: 300, marginBottom: 10 }} rowSpan={5} bordered value={values.observation} onChangeText={text => setFieldValue('observation', text)} />
          </Item>

        </Card>
        
        <Card>
          <TouchableOpacity onPress={openImagePickerCamAsync} style={{
            backgroundColor: "#E0A729",
            borderRadius: 6,
            marginBottom: 5,
            height: 45,
          }}>
            <Text style={styles.textButton}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={openImagePickerAsync} style={{
            backgroundColor: "#E0A729",
            borderRadius: 6,
            marginTop: 5,
            marginBottom: 5,
            height: 45,
          }}>
            <Text style={styles.textButton}>Seleccionar imagen</Text>
          </TouchableOpacity>
          
          {imageView(selectedImage)}
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
            <Text style={styles.textButton2}>CREAR</Text>
          </TouchableOpacity>
        </Card>
      </Form>
    </Content>
  </Container>
);
}
function imageView(option) {
  let url = './../assets/add.png';
  if (option !== null) {
    return (
      <View >
        <Image source={{ uri: option.localUri }} style={styles.logo} />
      </View>)
  } else {
    return (<View >
      <Image source={require(url)} style={styles.logo1} />
    </View>)
  }
}
function calculateDate(sentDate) {
  var today = sentDate;
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
    padding: 10,
    marginBottom:8,
  },
  Input: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 3,
    marginRight: 3,
    marginTop: 8,
    marginBottom: 8,
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
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16
  },
  textButton2: {
    padding: 15,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight:"bold",
  },
  logo: {
    width: 350,
    height: 200,
    marginBottom: 20,
    marginTop: 20,
    marginStart: 1,
    resizeMode: 'contain',
  },
  logo1: {
    width: 300,
    height: 100,
    marginBottom: 20,
    marginTop: 20,
    marginStart: 30,
    resizeMode: 'contain',
  },

});