import * as React from 'react';
import { StyleSheet, AsyncStorage,TouchableOpacity } from 'react-native';
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
                onValueChange={value => setFieldValue('plate', value)}
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
                onValueChange={value => setFieldValue('typeCheckList', value)}
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
                onValueChange={value => setFieldValue('driver', value)}
              >
                {/* Se modifican segun lo traido del web service */}
                <Picker.Item label="Seleccione una conductor" value="0" />
                {/* Valor guardado en asyncstorage */}
                <Picker.Item label="MZQ03" value="1" />
              </Picker>
            </Item>
          </Card>
          <Card style={styles.CardDisable}>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del checklist *</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleDateString()}</Text> */}
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={calculateDate()} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="calendar" /> <Text >  Fecha del siguiente checklist</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={values.dateNextCheckList} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-clock" /> <Text >  Hora del checklist *</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleTimeString()}</Text> */}
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={new Date().toLocaleTimeString()} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="plus" /> <Text >  Medición actual*</Text></Label>
              {/* <Text style={{ margin: 10 }}>{new Date().toLocaleDateString()}</Text> */}
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={''} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} type="FontAwesome" name="plus" /> <Text >  Medición del siguiente checklist</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={''} onChangeText={text => setFieldValue('dateCheckList', text)} />
            </Item>
          </Card>
          <Card>
            <Item stackedLabel style={styles.Item}>
              <Label> <Icon style={styles.LabelIcon} name="ios-text" /> <Text >  Observaciones</Text></Label>
              <Textarea style={{ width: 300, marginBottom: 10 }} rowSpan={5} bordered />
            </Item>
          </Card>
          <Card>
            <TouchableOpacity
              style={{
                backgroundColor: "#B98105",
                borderRadius: 6,
                width: 355,
                marginBottom:20
              }}
              onPress={console.log("Crear checklist")}
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
  let day = new Date().getDay();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
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
    margin: 10
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
    color: "#FFFFFF",
    fontSize: 16,
    textAlign:'center'
  }

});