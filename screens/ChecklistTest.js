import * as React from 'react';
import { StyleSheet, AsyncStorage,TouchableOpacity } from 'react-native';


import { useFormik } from 'formik';
import { Button, Textarea, DatePicker, Form, Card, Item, Label, Picker, Input, Content, Container, Header,Accordion } from 'native-base';



export default function ChecklistScreen({ navigation,route }) {

  const clGroup = route.params.checklistGroup;

  console.log(clGroup[clGroup.length-1]);

  //Autenticacion de checklist
  const dataArray = [
    { title: "Informacion", content: "Lorem ipsum dolor sit amet" },
    { title: "Desde el suelo", content: "Lorem ipsum dolor sit amet" },
    { title: "Comportamieto del motor", content: "Lorem ipsum dolor sit amet" },
    { title: "En la maquina fuera de cabina", content: "Lorem ipsum dolor sit amet" },
    { title: "Dentro de la cabina", content: "Lorem ipsum dolor sit amet" },
    { title: "Imagen", content: "Lorem ipsum dolor sit amet" }
  ];

  return (

    <Container>
        <Content padder>
          <Accordion dataArray={dataArray} expanded={0}/>
        </Content>
      </Container>
    
  );
}


const styles = StyleSheet.create({
  MenuStyle: {
    margin: 20
  },
  
});