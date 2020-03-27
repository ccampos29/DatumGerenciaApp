import * as React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
//import { Icon } from 'react-native-elements'
//import { createStackNavigator } from '@react-navigation/stack';

import { useFormik } from 'formik';
import { Button, Textarea, DatePicker, Form, Card, Item, Label, Picker, Input, Content, Container, Header, Icon, Text } from 'native-base';
//import {View, Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';



export default function CreateScreen({ navigation }) {

  //Autenticacion de checklist

  const { values, isSubmitting, setFieldValue } = useFormik({
    initialValues:
    {
      plate: '',
      typeCheckList: '',
      driver: '',
      dateCheckList: '',
      dateNextCheckList: '',
      time: '',
      currentMeasurement: '',
      nextMeasurement: '',
      observation: ''

    },
    onsubmit: values => {

    },


  });

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
                onValueChange={value => setFieldValue('plate',value)}
              >
                {/* Se modifican segun lo traido del web service */}
                <Picker.Item label="Seleccione una placa" value="0" />
                <Picker.Item label="MZQ03" value="1" />
              </Picker>
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="tasks" /> <Text >  Tipo del Checklist *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.SelectDisable}
                enabled={false}
                selectedValue={values.typeCheckList}
                onValueChange={value => setFieldValue('typeCheckList',value)}
              >
                {/* Se modifican segun lo traido del web service */}
                <Picker.Item label="Seleccione un checklist" value="0" />
                <Picker.Item label="Check 1" value="1" />
              </Picker>
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="user" /> <Text >  Conductor *</Text></Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={styles.Select}
                selectedValue={values.driver}
                onValueChange={value => setFieldValue('driver',value)}
              >
                {/* Se modifican segun lo traido del web service */}
                <Picker.Item label="Seleccione una conductor" value="0" />
                {/* Valor guardado en asyncstorage */}
                <Picker.Item label="MZQ03" value="1" />
              </Picker>
            </Item>
          </Card>
          <Card>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del checklist *</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleDateString()}</Text> */}
              <Input style={ styles.Input}editable={false} selectTextOnFocus={false} value={new Date().toLocaleDateString()} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del siguiente checklist</Text></Label>
              <Input style={ styles.Input}editable={false} selectTextOnFocus={false} value={values.dateNextCheckList} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-clock" /> <Text >  Hora del checklist *</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleTimeString()}</Text> */}
              <Input style={ styles.Input}editable={false} selectTextOnFocus={false} value={new Date().toLocaleTimeString()} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-text" /> <Text >  Observaciones</Text></Label>
              <Textarea style={{ width: 300, marginBottom: 10 }} rowSpan={5} bordered />
            </Item>
          </Card>
        </Form>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  MenuStyle: {
    margin: 20
  },
  Item:{
    padding: 10
  },
  Input:{
    borderWidth: 1,
    borderColor: "#20232a",
    borderRadius: 3,
    marginRight:3,
    marginTop:8,
    
  },
  Select:{
    width: 340, 
    margin: 10 
  },
  SelectDisable:{
    width: 340, 
    margin: 10,
    color: '#C0BEBE'
  },
  LabelIcon:{
    color: '#D5AE00'
  }
});