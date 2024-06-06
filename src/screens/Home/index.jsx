import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

// Importe suas imagens, estilos e outros recursos necessários
import logo from '../../../assets/logo.png';

export default function EpicVinheta() {
  // Animações podem ser adicionadas para dar um toque mais dinâmico à vinheta
  const fadeAnim = useRef(new Animated.Value(0)).current; // Exemplo de animação de fade
  const [isHovered, setIsHovered] = useState(false); // Estado para verificar se o mouse está sobre o botão

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  // Navegação para a próxima tela
  const navigation = useNavigation();

  // Funções para lidar com o mouse passando por cima e saindo do botão
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Aqui você pode incluir elementos visuais impressionantes, como um fundo dinâmico ou efeitos especiais */}
      
      {/* O cabeçalho com o título e o logotipo do aplicativo */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Intelligence</Text>
      </View>
      
      {/* Adicione elementos adicionais conforme necessário, como animações ou cenas específicas do aplicativo */}
      {/* Por exemplo, uma sequência rápida mostrando diferentes recursos do aplicativo */}
      <View style={styles.additionalContent}>
        {/* Conteúdo adicional aqui */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Game')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Text 
            style={[
              styles.buttonText, 
              isHovered && styles.buttonTextHovered // Aplica o estilo hover se o mouse estiver sobre o botão
            ]}
          >
            Iniciar
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
