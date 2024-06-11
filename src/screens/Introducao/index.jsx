import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
    <DrawerItem
      label="Fechar Menu"
      onPress={() => props.navigation.closeDrawer()}
      icon={() => <Ionicons name="close-outline" size={24} color="black" />}
    />
  </DrawerContentScrollView>
);

const BemVindoScreen = ({ navigation }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
      <Ionicons name="menu-outline" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.title}>Bem-vindo ao Mundo da Inteligência Artificial!</Text>
    <Image source={require('./intelligence.png')} style={styles.image} />
    <Text style={styles.subtitle}>Descubra como a IA está transformando o nosso dia a dia.</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Beneficios')}>
      <Text style={styles.buttonText}>Ver Benefícios</Text>
    </TouchableOpacity>
  </View>
);

const BeneficiosScreen = ({ navigation }) => (
  <View style={styles.container}>
    {/* Conteúdo dos benefícios aqui */}
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Desvantagens')}>
      <Text style={styles.buttonText}>Ver Desvantagens</Text>
    </TouchableOpacity>
  </View>
);

const DesvantagensScreen = ({ navigation }) => (
  <View style={styles.container}>
    {/* Conteúdo das desvantagens aqui */}
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BemVindo')}>
      <Text style={styles.buttonText}>Voltar ao Início</Text>
    </TouchableOpacity>
  </View>
);

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="BemVindo" component={BemVindoScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Beneficios" component={BeneficiosScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Desvantagens" component={DesvantagensScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  menuButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
});

export default App;