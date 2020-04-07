import * as React from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native';


import { useFormik } from 'formik';
import { Button, ListItem, CheckBox, Body, Icon, Text, Textarea, DatePicker, Form, Card, Item, Label, Picker, Input, Content, Container, Header, Accordion, View } from 'native-base';



export default function ChecklistScreen({ navigation, route }) {

  const clGroup = route.params.checklistGroup;

  //console.log(clGroup[0]);

  return (

    <Container>
      <Content padder>
        <Accordion
          dataArray={clGroup}
          animation={true}
          expanded={true}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "#E0A729",
            borderRadius: 6,
            marginTop: 20,
            marginBottom: 10,
            height:45,
          }}
          onPress={console.log('submit')}
        //onPress={()=>cargarChecklist(values)}
        >
          <Text style={styles.textButton}>Enviar</Text>
        </TouchableOpacity>



      </Content>

    </Container>

  );
}

function _renderHeader(item, expanded) {
  return (
    <View style={{
      flexDirection: "row",
      padding: 10,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#FEFFCE"
    }}>
      <Text style={{ fontWeight: "600" }}>
        {" "}{item.grupo.nombre}
      </Text>
      {expanded
        ? <Icon style={{ fontSize: 18, color: '#E0A729'}} name="remove-circle" />
        : <Icon style={{ fontSize: 18, color: '#E0A729' }} name="add-circle" />}
    </View>
  );
}

function _renderContent(item, values) {
  return (
    <Item stackedLabel style={styles.Item}>
      {item.grupo.novedades.map((element) => {
        return (
          <Content padder style={{ width: 300 }}>
              <Label style={{ marginTop:10 }}> <Text style={{ fontWeight: 'bold', marginTop:10 }} > Novedad</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={element.novedad.nombre} />
              <Label style={{ marginTop:10 }}> <Text style={{ fontWeight: 'bold' , marginTop:10}} > Criterio de evaluación</Text></Label>
              <Input style={styles.Input} editable={false} selectTextOnFocus={false} value={element.novedad.criterioEvaluacion.nombre} />
              <Label style={{ marginTop:10 }}> <Text style={{ fontWeight: 'bold'}} > Calificación</Text></Label>
              {calificacion(element.novedad.criterioEvaluacion.tipo)}
         </Content>
        )
      })}
    </Item>
  );
}

function calificacion(type) {
  if (type == "Lista desplegable") {
    return (
      <ListItem>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={styles.Select}
          enabled={true}
        >
          <Picker.Item key="-1" label="Seleccione un estado" value="-1" />
          <Picker.Item key="4" label="Bueno" value="4" />
          <Picker.Item key="5" label="Regular" value="5" />
          <Picker.Item key="6" label="Malo" value="6" />
        </Picker>
      </ListItem>
    )
  } else if (type == "Editable") {
    return (<Input style={styles.InputNivel} placeholder='Ingrese un número de 0 a 10' editable={true} selectTextOnFocus={false} value={''} onChangeText={''} />)
  } else{
    return (<ListItem>
      <Picker
        mode="dropdown"
        iosIcon={<Icon name="arrow-down" />}
        style={styles.Select}
        enabled={true}
      >
        <Picker.Item key="-1" label="Seleccione una opción" value="-1" />
        <Picker.Item key="4" label="Si" value="4" />
        <Picker.Item key="5" label="No" value="5" />
      </Picker>
    </ListItem>
    )
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
    marginRight: 3,
    marginTop: 8,
    backgroundColor: '#E7E7E7'

  },
  InputNivel: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 3,
    marginRight: 3,
    marginTop: 8,
    backgroundColor: '#FFFF'

  },
  textButton:{
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

});