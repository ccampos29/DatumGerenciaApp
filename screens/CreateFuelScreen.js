import * as React from 'react';
import { StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator, Modal } from 'react-native';
import { useFormik } from 'formik';
import { Textarea, Form, Card, Item, Label, Picker, Input, Content, Container, Header, Icon, Text } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { View } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import Alert from "./UI/Alert";
import AlertSuccess from "./UI/AlertSuccess";
import * as Yup from 'yup';

export default function CreateFuelScreen({ navigation, route }) {
  // console.log(route.params.fuelData);
  //console.log(route.params.countryData);

  const vehicleList = route.params.vehicleData;
  const costsCenterList = route.params.fuelData.centrosCostos;
  const fuelTypeList = route.params.fuelData.combustibles;
  const associatedGroupList = route.params.fuelData.grupoVehiculos;
  const providerList = route.params.fuelData.proveedores;
  const countryList = route.params.countryData.results;

  const validationSchema = Yup.object({
    full: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    cost: Yup.string().matches(/^([0-9])+$/).required('Required'),
    quantity: Yup.string().matches(/^([0-9])+$/).required('Required'),
    provider: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    ticketNumber: Yup.string().matches(/^([0-9])+$/).required('Required'),
    vehicle: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    fuelType: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    associatedGroup: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    userMeasurement: Yup.string().matches(/^([0-9])+$/).required('Required'),
    costsCenter: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    country: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    department: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    city: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
    urlImage: Yup.string().matches(/^(?!^'').*$/).required('Required'),
    driver: Yup.string().matches(/^(?!^-1).*$/).required('Required'),
  });

  const { values, isSubmitting, setFieldValue, handleSubmit, errors } = useFormik({
    initialValues:
    {
      carga: false,
      visibleError: false,
      erroMsg: '',
      visibleSuccess: false,
      successMsg: '',
      drivers: new Array(),
      date: calculateDate(new Date()), //necesarios para el diligenciamiento de CL
      time: new Date().toLocaleTimeString(),
      full: '',
      cost: '',
      quantity: '',
      provider: '',
      ticketNumber: '',
      vehicle: '',
      fuelType: '',
      associatedGroup: '',
      userMeasurement: '0',
      measurement: '',
      costsCenter: '',
      country: '',
      department: '',
      city: '',
      observation: '',
      imageSource: '',
      urlImage: '',
      driver: '',

      departmentList: new Array(),
      cityList: new Array(),
    },
    onSubmit: (values) => {
      //console.log("Se hizo submit con: ");
      //console.log(values);
      setFieldValue('carga', true);
      var bodyWS = {
        "Combustibles":
        {
          "fecha": values.date,
          "hora": values.time,
          "tanqueo_full": values.full,
          "costo_por_galon": values.cost,
          "cantidad_combustible": values.quantity,
          "proveedor_id": values.provider,
          "numero_tiquete": values.ticketNumber,
          "vehiculo_id": values.vehicle,
          "tipo_combustible_id": values.fuelType,
          "usuario_id": values.driver,
          "grupo_vehiculo_id": values.associatedGroup,
          "medicion_actual": values.userMeasurement, //el que digita el usuario
          "medicion_compare": values.measurement, //el del webservice
          "centro_costo_id": values.costsCenter,
          "pais_id": values.country,
          "departamento_id": values.department,
          "municipio_id": values.city,
          "observacion": values.observation,
          "empresa_id": route.params.user.userCompanyId,
        }
      };
      var info = new FormData();
      let filename = values.urlImage.split('/').pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      info.append('data', JSON.stringify(bodyWS));
      info.append('imagenCombustible', { uri: values.urlImage, name: filename, type });
      //console.log(bodyWS);

      var parameters = new URLSearchParams({
        id_empresa: route.params.userToken.userCompanyId,
        id_user: route.params.userToken.userId,
      });
      // console.log(info);
      var urlStore = 'http://gerencia.datum-position.com/api/combustible/storecombustible?' + parameters.toString();
      fetch(urlStore, {
        method: 'POST',
        headers: {
          Accept: "*/*",
          'Content-Type': 'multipart/form-data;',
          'Authorization': 'Bearer ' + route.params.userToken.token,
          'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5'
        },
        body: info
      }).then(res => res.json())
        .then(resData => {
          console.log(resData);
          if (resData.status === "success") {
            var result = resData.message;
            //alert(prueba);
            setFieldValue('carga', false);
            setFieldValue('successMsg', result);
            setFieldValue('visibleSuccess', true);
            setTimeout(() => {
              setFieldValue('visibleSuccess', false);
              navigation.navigate('Home');
            }, 7000);

          } else {
            setFieldValue('carga', false);
            //alert("Error en la creacion de Combustible, verifique el formulario");
            setFieldValue('errorMsg', 'Error en la creacion de Combustible, verifique el formulario');
            setFieldValue('visibleError', true);
            setTimeout(() => {
              setFieldValue('visibleError', false);
            }, 3000);
          }

        })
        .catch(e => {
          console.log(e.message);
          setFieldValue('carga', false);
          setFieldValue('errorMsg', 'Error comunicandose con Datum Gerencia para crear el combustible');
          setFieldValue('visibleError', true);
          setTimeout(() => {
            setFieldValue('visibleError', false);
          }, 3000);
          //alert("Error comunicandose con Datum Gerencia para crear el combustible");
        });

    },
    validationSchema,
  });

  const seleccionarVehiculo = async (value) => {
    if (value != "-1") {
      setFieldValue('vehicle', value);
      setFieldValue('carga', true);
      var parametros = new URLSearchParams({
        vehicle_id: value,
      });

      var url = 'http://gerencia.datum-position.com/api/checklist/consultamedicion?' + parametros.toString();

      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          //console.log(resData);
          if (resData.status === "success") {
            setFieldValue('measurement', resData.data.valor);
          } else {
            setFieldValue('carga', false);
            setFieldValue('errorMsg', 'Error obteniendo la medicion de odometro del vehiculo');
            setFieldValue('visibleError', true);
            setTimeout(() => {
              setFieldValue('visibleError', false);
            }, 3000);
            //alert("Error obteniendo la medicion de odometro del vehiculo");
          }
        }).catch(e => {
          setFieldValue('carga', false);
          setFieldValue('errorMsg', 'Error comunicandose con Datum Gerencia para odometro');
          setFieldValue('visibleError', true);
          setTimeout(() => {
            setFieldValue('visibleError', false);
          }, 3000);
          //alert("Error comunicandose con Datum Gerencia para odometro");
        });
      //setFieldValue('carga', false);

      var parametrosCL = new URLSearchParams({
        vehicle_id: value, //CARLITOS QUE SEAN IGUALES LOS PARAMETROS NOS AYUDARIA POR ACA
      });

      var url = 'http://gerencia.datum-position.com/api/checklist/getuserbyvehicle?' + parametrosCL.toString();
      //console.log(url);
      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          //console.log(resData);
          if (resData.length > 0) {
            setFieldValue('driver', '-1');
            setFieldValue('drivers', resData);
            setFieldValue('driverEnable', true);
            setFieldValue('carga', false);
          } else {
            setFieldValue('carga', false);
            setFieldValue('errorMsg', 'Error obteniendo los conductores que tiene el vehiculo');
            setFieldValue('visibleError', true);
            setTimeout(() => {
              setFieldValue('visibleError', false);
            }, 3000);
            //alert("Error obteniendo los conductores que tiene el vehiculo");
          }
        }).catch(e => {
          setFieldValue('carga', false);
          setFieldValue('errorMsg', 'Error comunicandose con Datum Gerencia para obtener conductores');
          setFieldValue('visibleError', true);
          setTimeout(() => {
            setFieldValue('visibleError', false);
          }, 3000);
          //alert("Error comunicandose con Datum Gerencia para obtener conductores");
        });

    }
  }

  const seleccionarPais = async (value) => {
    if (value != "-1") {
      setFieldValue('country', value);

      var parametros = new URLSearchParams({
        id_pais: value,
      });

      var url = 'http://gerencia.datum-position.com/api/combustible/getdepartamentos?' + parametros.toString();

      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          if (resData.length > 0) {
            setFieldValue('departmentList', resData);
          } else {
            //setFieldValue('carga', false);
            setFieldValue('errorMsg', 'El pais no tiene departamentos');
            setFieldValue('visibleError', true);
            setTimeout(() => {
              setFieldValue('visibleError', false);
            }, 3000);
            //alert("El pais no tiene departamentos");
          }
        }).catch(e => {
          setFieldValue('errorMsg', 'Error comunicandose con Datum Gerencia para sleccionar un pais');
          setFieldValue('visibleError', true);
          setTimeout(() => {
            setFieldValue('visibleError', false);
          }, 3000);
          //alert("Error comunicandose con Datum Gerencia para sleccionar un pais");
        });
    }
  }

  const seleccionarDepartamento = async (value) => {
    if (value != "-1") {
      setFieldValue('department', value);

      var parametros = new URLSearchParams({
        id_departamento: value,
      });

      var url = 'http://gerencia.datum-position.com/api/combustible/getmunicipios?' + parametros.toString();

      await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + route.params.userToken.token
        }
      }).then(res => res.json())
        .then(resData => {
          if (resData.length > 0) {
            setFieldValue('cityList', resData);
          } else {
            setFieldValue('errorMsg', 'El departamento no tiene ciudades');
            setFieldValue('visibleError', true);
            setTimeout(() => {
              setFieldValue('visibleError', false);
            }, 3000);
            //alert("El departamento no tiene ciudades");
          }
        }).catch(e => {
          setFieldValue('errorMsg', 'Error comunicandose con Datum Gerencia para seleccionar un departamento');
          setFieldValue('visibleError', true);
          setTimeout(() => {
            setFieldValue('visibleError', false);
          }, 3000);
          //alert("Error comunicandose con Datum Gerencia para seleccionar un departamento");
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
      setFieldValue('errorMsg', 'El permiso de acceso a cámara y galeria son requeridos!');
      setFieldValue('visibleError', true);
      setTimeout(() => {
        setFieldValue('visibleError', false);
      }, 3000);
      //alert('El permiso de acceso a cámara y galeria son requeridos!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5
    });
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
    // values.urlImage = pickerResult.uri;
    //console.log(values.urlImage);

  };

  let openImagePickerCamAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      setFieldValue('errorMsg', 'El permiso de acceso a cámara y galeria son requeridos!');
      setFieldValue('visibleError', true);
      setTimeout(() => {
        setFieldValue('visibleError', false);
      }, 3000);
      //alert('El permiso de acceso a cámara y galeria son requeridos!');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });
    if (pickerResult.cancelled === true) {
      return;
    }

    // console.log(pickerResult);

    setSelectedImage({ localUri: pickerResult.uri });;
    //values.urlImage = pickerResult.uri;
    //console.log(values.urlImage);

  };

  const seleccionarFechaHora = (event, selecDate) => {
    const currentDate = selecDate || selectedDate;
    setShow(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    if (mode === 'date') {
      setFieldValue('date', calculateDate(currentDate));
    } else {
      if (mode === 'time') {
        setFieldValue('time', currentDate.toLocaleTimeString());
      }
    }
  };

  const seleccionarConductor = async (value) => {
    if (value != "-1") {
      setFieldValue('driver', value);
    }

  }

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
        <Modal
          animationType="slide"
          transparent={true}
          visible={values.carga}
        >
          <ActivityIndicator style={styles.activityIndicator} animating={values.carga} size="large" color="#E0A729" />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={values.visibleError}
        >
          <Alert mensaje={values.errorMsg} visible={values.visibleError}></Alert>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={values.visibleSuccess}
        >
          <AlertSuccess mensaje={values.successMsg} visible={values.visibleSuccess}></AlertSuccess>
        </Modal>
        <Form>
          <Card style={styles.CardDisable}>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del tanqueo *</Text></Label>
              <TouchableOpacity onPress={showDatepicker}>
                <View style={{ height: 70, width: 345 }}>
                  <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.date} />
                </View>
              </TouchableOpacity>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-clock" /> <Text >  Hora del tanqueo *</Text></Label>
              <TouchableOpacity onPress={showTimepicker}>
                <View style={{ height: 70, width: 345 }}>
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
              <Text style={styles.fieldTextError}>{errors.full ? "El tanqueo full es requerido" : null}</Text>
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
                <Picker.Item key="No" label="No" value="0" />
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Text style={styles.fieldTextError}>{errors.cost ? "El costo es requerido" : null}</Text>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="dollar-sign" /> <Text >  Costo por Galon *</Text></Label>
              <Input keyboardType='numeric' style={styles.Input} editable={true} selectTextOnFocus={false} value={values.cost} onChangeText={text => setFieldValue('cost', text)} />
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Text style={styles.fieldTextError}>{errors.quantity ? "La cantidad es requerida" : null}</Text>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="hashtag" /> <Text >  Cantidad de Combustible *</Text></Label>
              <Input keyboardType='numeric' style={styles.Input} editable={true} selectTextOnFocus={false} value={values.quantity} onChangeText={text => setFieldValue('quantity', text)} />
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Text style={styles.fieldTextError}>{errors.provider ? "El proveedor es requerido" : null}</Text>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="gas-pump" /> <Text >  Proveedor *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                enabled={true}
                selectedValue={values.provider}
                onValueChange={value => setFieldValue('provider', value)}
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
              <Text style={styles.fieldTextError}>{errors.ticketNumber ? "El tiquete es requerido" : null}</Text>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="hashtag" /> <Text >  Numero del tiquete</Text></Label>
              <Input keyboardType='numeric' style={styles.Input} editable={true} selectTextOnFocus={false} value={values.ticketNumber} onChangeText={text => setFieldValue('ticketNumber', text)} />
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Text style={styles.fieldTextError}>{errors.vehicle ? "El vehiculo es requerido" : null}</Text>
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
              <Text style={styles.fieldTextError}>{errors.fuelType ? "El tipo es requerido" : null}</Text>
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
              <Text style={styles.fieldTextError}>{errors.driver ? "El conductor es requerido" : null}</Text>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="user" /> <Text >  Cargar a *</Text></Label>
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
                    <Picker.Item key={driver.id_number + "-" + driver.name + " " + driver.surname} label={driver.id_number + " - " + driver.name + " " + driver.surname} value={driver.id} />
                  )
                })}
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Text style={styles.fieldTextError}>{errors.associatedGroup ? "El grupo es requerido" : null}</Text>
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
              <Text style={styles.fieldTextError}>{errors.userMeasurement ? "La medicion es requerida" : null}</Text>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="plus" /> <Text >  Medición *</Text></Label>
              <Input keyboardType='numeric' style={styles.Input} editable={true} selectTextOnFocus={false} value={values.userMeasurement} onChangeText={text => setFieldValue('userMeasurement', text)} />
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="plus" /> <Text >  Medición Web Service *</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.measurement} onChangeText={text => setFieldValue('measurement', text)} />
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Text style={styles.fieldTextError}>{errors.costsCenter ? "El centro es requerido" : null}</Text>
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
              <Text style={styles.fieldTextError}>{errors.country ? "El pais es requerido" : null}</Text>
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
              <Text style={styles.fieldTextError}>{errors.department ? "El departamento es requerido" : null}</Text>
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
              <Text style={styles.fieldTextError}>{errors.city ? "La ciudad es requerida" : null}</Text>
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

            <Text style={styles.fieldTextError}>{errors.urlImage ? "La imagen es requerida" : null}</Text>
            {imageView(selectedImage, values)}
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

function imageView(option, values) {
  let url = './../assets/add.png';
  if (option !== null) {
    values.urlImage = Platform.OS === "android" ? option.localUri : option.localUri.replace("file://", "");
    // console.log(values.urlImage);
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
    marginBottom: 8,
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
    fontWeight: "bold",
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'rgba(234, 234, 234, 0.4)',
  },
  fieldTextError: {
    color: '#ff0000',
    fontSize: 14,
    textAlign: 'center',
  }

});