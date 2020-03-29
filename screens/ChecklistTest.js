import * as React from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native';


import { useFormik } from 'formik';
import { Button, Icon, Text, Textarea, DatePicker, Form, Card, Item, Label, Picker, Input, Content, Container, Header, Accordion, View } from 'native-base';



export default function ChecklistScreen({ navigation }) {

  //Autenticacion de checklist
  const dataArray = [
    { title: "Desde el suelo", content: contenido() },
    { title: "Comportamieto del motor", content: "Lorem ipsum dolor sit amet", novedad: "PruebaNovedad", criterio: "B-R-M" },
    { title: "En la maquina fuera de cabina", content: "Lorem ipsum dolor sit amet", novedad: "PruebaNovedad", criterio: "B-R-M" },
    { title: "Dentro de la cabina", content: "Lorem ipsum dolor sit amet", novedad: "PruebaNovedad", criterio: "B-R-M" },
    { title: "Imagen", content: "Lorem ipsum dolor sit amet", novedad: "PruebaNovedad", criterio: "B-R-M" }
  ];

  return (

    <Container>
      <Content padder>
        <Accordion dataArray={dataArray} icon="add" expandedIcon="remove" />

      </Content>

    </Container>

  );
}

function contenido() {
  return (
    <Text >  Novedad</Text>
  );
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

});