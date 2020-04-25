import * as React from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';

import { useFormik } from 'formik';
import { ListItem, Body, Icon, Text, Form, Item, Label, Picker, Input, Content, Container, Header, Accordion, View } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Card from './UI/Card';
import Alert from "./UI/Alert";


export default function ChecklistScreen({ navigation, route }) {

  const clGroup = route.params.checklistGroup;
  const clInfo = route.params.checklistInfo;
  let cont = -1;

  // const form = clGroup.map((grupo)=>{
  //   return grupo.grupo.novedades;
  // }).map((novedad)=>{
  //   return {};
  // });

  const { values, isSubmitting, setFieldValue, handleSubmit, handleChange } = useFormik({
    initialValues:
    {
      carga: false,
      alerta: false,
      novedadesCalificadas: [].concat.apply([], clGroup.map(grupo => {
        return grupo.grupo.novedades.map(novedad => {
          return {
            "grupo_novedad_id": grupo.grupo.id,
            "novedad_id": novedad.novedad.id,
            "criterio_calificacion_id": novedad.novedad.criterio_evaluacion_id,
            "valor_texto_calificacion": '',
            "vehiculo_id": clInfo.id_vehiculo,
            "tipo_checklist_id": clInfo.id_tipo_checklist,
            "checklis_id": clInfo.id_checklist,
            "empres_id": route.params.user.userCompanyId,
          };
        })
      }
      )),
      urlImage: '',
    },
    onSubmit: async (values) => {
      setFieldValue('carga', true);
      var info = new FormData();
      var bodyWS = {
        "id_checklist": clInfo.id_checklist,
        "data": {
          "novedadesCalificadas": values.novedadesCalificadas,

        },
      };

      let filename = values.urlImage.split('/').pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      console.log(bodyWS);
      info.append('data', JSON.stringify(bodyWS));
      info.append('imagenChecklist', { uri: values.urlImage, name: filename, type });
      var urlCal = 'http://gerencia.datum-position.com/api/checklist/calificarchecklist';
      // console.log(info);  
      await fetch(urlCal, {
        method: 'POST',
        headers: {
          Accept: "*/*",
          'Content-Type': 'multipart/form-data;',
          Authorization: 'Bearer ' + route.params.userToken,
          'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5'
        },
        body: info
      }).then(res => res.json())
        .then(resData => {
          console.log(resData);
          setFieldValue('carga', false);
          if(resData.status==="success"){
            var prueba = clInfo.id_checklist+' '+resData.nombre_checklist + "\n\n" +
                    resData.creador_checklist + "\n" +
                    "Vehiculo: " + resData.vehiculo + "\n" +
                    "Estado: " + resData.estado_checklist + "\n" +
                    "Aprobado:" + resData.procentaje_aprobado + "\n" +
                    "Rechazado:" + resData.procentaje_rechazado + "\n" +
                    "Critico:" + resData.procentaje_rechazado_critico + "\n" +
                    "TOTAL:" + resData.total;
            alert(prueba);
            navigation.navigate('Home');
            
          }else{
            alert("Error en la creacion de Checklist, verifique el formulario");
          }
          //setFieldValue('alerta', true);

        })
        .catch(e => {
          console.log(e.message);
          console.log(e);
          alert("Error comunicandose");
        });

    },

  });

  //setSelectedImage({ localUri: './../assets/add3.png' });
  let [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('El permiso de acceso a cámara y galeria son requeridos!');
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
      alert('El permiso de acceso a cámara y galeria son requeridos!');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });
    if (pickerResult.cancelled === true) {
      return;
    }

    console.log(pickerResult);

    setSelectedImage({ localUri: pickerResult.uri });;
    //values.urlImage = pickerResult.uri;
    //console.log(values.urlImage);

  };

  //console.log(values.novedadesCalificadas);


  return (

    <Container>
      <Content padder>
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
          visible={values.alerta}
        >
          <Alert visible={values.alerta}><Text>Hola mundo</Text></Alert>
        </Modal>
        <Form>

          {clGroup.map((grupo) => {
            return (
              <Card style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: "bold", fontSize: 25, margin: 10, marginBottom: 5 }}>{grupo.grupo.nombre}</Text>

                {grupo.grupo.novedades.map((novedad, index) => {

                  cont++;
                  // let objNov = {"grupo_novedad_id" : grupo.grupo.id,
                  //               "novedad_id":novedad.novedad.id,
                  //               "criterio_calificacion_id":novedad.novedad.criterio_evaluacion_id,
                  //               "valor_texto_calificacion":'-1',
                  //               "vehiculo_id":clInfo.id_vehiculo,
                  //               "tipo_checklist_id":clInfo.id_tipo_checklist,
                  //               "checklis_id":clInfo.id_checklist,
                  // };

                  // setFieldValue('novedadesCalificadas',[...values.novedadesCalificadas, objNov]);

                  //console.log(values.novedadesCalificadas[0]);
                  //console.log(cont);
                  return (
                    <Item stackedLabel style={{ padding: 10, margin: 5 }}>
                      <Label style={{ margin: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Novedad: </Text>
                      </Label>
                      <Label style={styles.Input}>
                        <Text style={{ fontSize: 18 }} > {novedad.novedad.nombre}</Text>
                      </Label>
                      <Label style={{ margin: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Criterio de evaluación: </Text>
                      </Label>
                      <Label style={styles.Input}>
                        <Text style={{ fontSize: 18 }} > {novedad.novedad.criterioEvaluacion.nombre} </Text>
                      </Label>
                      <Label style={{ margin: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }} >Calificación:</Text>
                      </Label>
                      {(novedad.novedad.criterioEvaluacion.tipo == "Lista desplegable") ? (
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" />}
                          style={styles.Select}
                          enabled={true}
                          selectedValue={values.novedadesCalificadas[cont].valor_texto_calificacion}
                          onValueChange={handleChange('novedadesCalificadas[' + cont + '].valor_texto_calificacion')}
                        >
                          <Picker.Item key="-1" label="Seleccione un estado" value="-1" />
                          <Picker.Item key="4" label="Bueno" value="4" />
                          <Picker.Item key="5" label="Regular" value="5" />
                          <Picker.Item key="6" label="Malo" value="6" />
                        </Picker>
                      ) : ((novedad.novedad.criterioEvaluacion.tipo == "Editable") ? (
                        <Input style={styles.InputNivel}
                          placeholder='Ingrese un número de 0 a 10'
                          editable={true} selectTextOnFocus={false}
                          value={values.novedadesCalificadas[cont].valor_texto_calificacion}
                          onChangeText={handleChange('novedadesCalificadas[' + cont + '].valor_texto_calificacion')}
                        />
                      ) : (
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={styles.Select}
                            enabled={true}
                            selectedValue={values.novedadesCalificadas[cont].valor_texto_calificacion}
                            onValueChange={handleChange('novedadesCalificadas[' + cont + '].valor_texto_calificacion')}
                          >
                            <Picker.Item key="-1" label="Seleccione una opción" value="-1" />
                            <Picker.Item key="1" label="Si" value="1" />
                            <Picker.Item key="2" label="No" value="2" />
                          </Picker>
                        ))
                      }
                    </Item>
                  )
                })}
              </Card>
            )
          })}




          {/* <Accordion
            dataArray={clGroup}
            animation={true}
            expanded={true}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
          /> */}
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

            {imageView(selectedImage, values)}
          </Card>

          <TouchableOpacity
            style={{
              backgroundColor: "#E0A729",
              borderRadius: 6,
              marginTop: 20,
              marginBottom: 10,
              height: 45,
            }}
            onPress={handleSubmit}
          >
            <Text style={styles.textButton}>Enviar</Text>
          </TouchableOpacity>
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
    backgroundColor: '#E7E7E7',
    margin: 3,
    width: 280,
    height: 40

  },
  InputNivel: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 3,
    marginRight: 3,
    marginTop: 8,
    backgroundColor: '#FFFF'

  },
  textButton: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16

  },
  Select: {
    width: 280,
    margin: 8,
    marginLeft: -3
  },
  SelectDisable: {
    width: 340,
    margin: 10,
    color: '#C0BEBE'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'rgba(234, 234, 234, 0.4)',
  }

});