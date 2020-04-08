import * as React from 'react';
import { StyleSheet, AsyncStorage,TouchableOpacity } from 'react-native';
//import { Icon } from 'react-native-elements'
//import { createStackNavigator } from '@react-navigation/stack';
import { useFormik } from 'formik';
import { Button, Textarea, DatePicker, Form, Card, Item, Label, Picker, Input, Content, Container, Header, Icon, Text } from 'native-base';
//import {View, Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';
import { AuthContext } from '../context/AuthContext';

export default function CreateFuelScreen({ navigation, route }) {
  //console.log(route.params.userToken);
  
  const { values, isSubmitting, setFieldValue, handleSubmit } = useFormik({
    initialValues:
    {
      date: calculateDate(), //necesarios para el diligenciamiento de CL
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
      measurement: '',
      costsCenter: '',
      country: '',
      department: '',
      city: '',
      observation: '',
      imageSource: '',

      typeCheckListEnable: false,  //no necesarios para el diligenciamiento de CL
      checklistTypes: new Array(),

    },
    onSubmit: (values) => {
      //console.log("Se hizo submit con: ");
      //console.log(values);
    },


  });

  return (
    <Container>
      <Content>
        <Form>
          <Card style={styles.CardDisable}>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del tanqueo *</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.date} />
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-clock" /> <Text >  Hora del tanqueo *</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.time} />
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="gas-pump" /> <Text >  Tanqueo Full *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                enabled={true}
                selectedValue={values.full}
                onValueChange={value => setFieldValue('full',value)}
              >
                <Picker.Item key="-1" label="Seleccione una opcion..." value="-1" />
                <Picker.Item key="Si" label="Si" value="Si" />
                <Picker.Item key="Si" label="No" value="No" />
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="dollar-sign" /> <Text >  Costo por Galon *</Text></Label>
              <Input style={styles.Input} editable={true} selectTextOnFocus={false} value={values.cost} onChangeText={text => setFieldValue('cost', text)}/>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="hashtag" /> <Text >  Cantidad de Combustible *</Text></Label>
              <Input style={styles.Input} editable={true} selectTextOnFocus={false} value={values.quantity} onChangeText={text => setFieldValue('quantity', text)}/>
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
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="hashtag" /> <Text >  Numero del tiquete</Text></Label>
              <Input style={styles.Input} editable={true} selectTextOnFocus={false} value={values.ticketNumber} onChangeText={text => setFieldValue('ticketNumber', text)}/>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="car" /> <Text >  Vehiculo *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                enabled={true}
                selectedValue={values.vehicle}
                onValueChange={value => setFieldValue('vehicle',value)}
              >
                <Picker.Item key="-1" label="Seleccione un vehiculo..." value="-1" />
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="list" /> <Text >  Tipo de Combustible *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                enabled={true}
                selectedValue={values.vehicle}
                onValueChange={value => setFieldValue('vehicle',value)}
              >
                <Picker.Item key="-1" label="Seleccione un tipo..." value="-1" />
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="user" /> <Text >  Cargar a *</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={route.params.userToken.userCC +"-" +route.params.userToken.userName} onChangeText={text => setFieldValue('driver', text)} />
            </Item>
            
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="users" /> <Text >  Grupo Asociado *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                enabled={true}
                selectedValue={values.associatedGroup}
                onValueChange={value => setFieldValue('associatedGroup',value)}
              >
                <Picker.Item key="-1" label="Seleccione un grupo..." value="-1" />
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome5" name="plus" /> <Text >  Medición *</Text></Label>
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
                onValueChange={value => setFieldValue('costsCenter',value)}
              >
                <Picker.Item key="-1" label="Seleccione un centro..." value="-1" />
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
                onValueChange={value => setFieldValue('country',value)}
              >
                <Picker.Item key="-1" label="Seleccione un pais..." value="-1" />
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
                onValueChange={value => setFieldValue('department',value)}
              >
                <Picker.Item key="-1" label="Seleccione un departamento..." value="-1" />
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
                onValueChange={value => setFieldValue('city',value)}
              >
                <Picker.Item key="-1" label="Seleccione una ciudad..." value="-1" />
              </Picker>
            </Item>

            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-text" /> <Text >  Observaciones</Text></Label>
              <Textarea style={{ width: 300, marginBottom: 10 }} rowSpan={5} bordered value={values.observation} onChangeText={text => setFieldValue('observation', text)}/>
            </Item>

          </Card>
          <Card>
            <Button
              style={{
                backgroundColor: "#B98105",
                borderRadius: 6,
                marginBottom:20,
              }}
              onPress={handleSubmit}
              //onPress={()=>cargarChecklist(values)}
            >
              <Text style={styles.textButton}>Crear</Text>
            </Button>
          </Card>
        </Form>
      </Content>
    </Container>
  );
}

function calculateDate() {
  var today = new Date();
  let day = today.getDate();
  let month = today.getMonth()+1;
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
    marginLeft:130
    
    
  }

});