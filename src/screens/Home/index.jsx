import { View, Image, Text } from "react-native";

import styles from "./styles";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.foto} source={require('../../../assets/logo.png')}/>
        <Text style={styles.titulo}>Intelligence</Text>
      </View>
    </View>
  );
}
