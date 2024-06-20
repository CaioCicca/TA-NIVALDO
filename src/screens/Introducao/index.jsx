import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated, Vibration, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useNavigation } from "@react-navigation/native";
import styles from "./styles.js";

const Introducao = () => {
  const navigation = useNavigation();

  const [section, setSection] = useState('BemVindo');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);
  const [audioStatus, setAudioStatus] = useState(false);
  const [sound, setSound] = useState(null);
  const [previousSection, setPreviousSection] = useState(null);

  useEffect(() => {
    animateContent();
    if (audioStatus) {
      playAudio();
    } else {
      stopAudio();
    }
  }, [section]);

  const animateContent = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const changeSection = (newSection) => {
    setPreviousSection(section);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSection(newSection);
      setProgress(progress + 1);
      animateContent();
    });
  };

  const handlePress = (newSection) => {
    changeSection(newSection);
    Vibration.vibrate(100);
    readText(newSection);
  };

  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/victory.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  };

  const readText = (newSection) => {
    let textToRead = '';
    switch (newSection) {
      case 'BemVindo':
        textToRead = 'Bem-vindo ao Mundo da Inteligência Artificial! Descubra como a IA está transformando o nosso dia a dia.';
        break;
      case 'Beneficios':
        textToRead = `Benefícios da IA. A IA pode melhorar a eficiência, reduzir custos, aumentar a precisão e personalizar experiências.
        
        Maior eficácia na tomada de decisões e na execução de tarefas, com maior precisão;
        
        Tem a capacidade de funcionar de maneira ininterrupta e realizar tarefas repetitivas;
        
        Resultou em melhorias no processo de compra e venda online.`;
        break;
      case 'Desvantagens':
        textToRead = `Desvantagens da IA. A IA pode levar à perda de empregos, criar vieses algorítmicos, e levantar questões éticas.
        
        Apresentam elevado custo de desenvolvimento e implementação, sendo um recurso restrito;
        
        A automação de tarefas e da tomada de decisões tendem a ocasionar desemprego estrutural;
        
        Têm avanços limitados mesmo com maior acúmulo de experiência.`;
        break;
      case 'ComoFunciona':
        textToRead = `Como funciona a inteligência artificial. O Funcionamento da inteligência artificial, de maneira simplificada, acontece por meio da coleta e de combinação de um grande volume de dados seguido da identificação de determinados padrões nesse conjunto de informações.Com esse processo, que geralmente se dá mediante a utilização de algoritmos pré-programados, o software consegue tomar decisões e realizar tarefas de maneira autônoma.

        Métodos da IA:
        
        Machine learning:
        
        chamado de aprendizado de máquina, é o processo que acontece de maneira automatizada. O reconhecimento e a reprodução de padrões feitos pela IA com base na sua experiência prévia, adiquiridos pela utilização de algoritmos.
        
        Deep learning:
        
        subcampo do machine learning, utiliza-se de redes neurais (unidades conectadas em rede para análise de bancos de dados e informações) para emular o cérebro humano.`;
        break;
      case 'Exemplos':
        textToRead = `Exemplos de inteligência artificial no dia a dia:
        
        Assistentes de voz;
        
        Reconhecimento facial;
        
        Redes sociais.`;
        break;
      default:
        break;
    }
    Speech.speak(textToRead);
  };

  const renderContent = () => {
    switch (section) {
      case 'BemVindo':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Bem-vindo ao Mundo da Inteligência Artificial!</Text>
            <Text style={styles.subtitle}>Descubra como a IA está transformando o nosso dia a dia.</Text>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('Beneficios')}>
              <Text style={styles.buttonText}>Ver Benefícios</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Beneficios':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Benefícios da IA</Text>
            <Text style={styles.text}>
              A IA pode melhorar a eficiência, reduzir custos, aumentar a precisão e personalizar experiências.
              
              Maior eficácia na tomada de decisões e na execução de tarefas, com maior precisão;
              
              Tem a capacidade de funcionar de maneira ininterrupta e realizar tarefas repetitivas;
              
              Resultou em melhorias no processo de compra e venda online.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('Desvantagens')}>
              <Text style={styles.buttonText}>Ver Desvantagens</Text>
            </TouchableOpacity>
            {previousSection && (
              <TouchableOpacity style={styles.button} onPress={() => handlePress(previousSection)}>
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      case 'Desvantagens':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Desvantagens da IA</Text>
            <Text style={styles.text}>
              A IA pode levar à perda de empregos, criar vieses algorítmicos, e levantar questões éticas.
              
              Apresentam elevado custo de desenvolvimento e implementação, sendo um recurso restrito;
              
              A automação de tarefas e da tomada de decisões tendem a ocasionar desemprego estrutural;
              
              Têm avanços limitados mesmo com maior acúmulo de experiência.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('ComoFunciona')}>
              <Text style={styles.buttonText}>Como Funciona</Text>
            </TouchableOpacity>
          </View>
        );
      case 'ComoFunciona':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Como Funciona a IA</Text>
            <Text style={styles.text}>
              O Funcionamento da inteligência artificial, de maneira simplificada, acontece por meio da coleta e de combinação de um grande volume de dados seguido da identificação de determinados padrões nesse conjunto de informações.Com esse processo, que geralmente se dá mediante a utilização de algoritmos pré-programados, o software consegue tomar decisões e realizar tarefas de maneira autônoma.
              
              Métodos da IA:
              
              Machine learning:
              
              chamado de aprendizado de máquina, é o processo que acontece de maneira automatizada. O reconhecimento e a reprodução de padrões feitos pela IA com base na sua experiência prévia, adiquiridos pela utilização de algoritmos.
              
              Deep learning:
              
              subcampo do machine learning, utiliza-se de redes neurais (unidades conectadas em rede para análise de bancos de dados e informações) para emular o cérebro humano.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('Exemplos')}>
              <Text style={styles.buttonText}>Exemplos de IA</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Exemplos':
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Exemplos de IA no Dia a Dia</Text>
            <Text style={styles.text}>
              Assistentes de voz;
              
              Reconhecimento facial;
              
              Redes sociais.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game')}>
              <Text style={styles.buttonText}>Jogar</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={require('../../../assets/logo.png')} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={{ opacity: fadeAnim, flex: 1, width: '100%' }}>
          {renderContent()}
        </Animated.View>
        <View style={styles.progressBar}>
          <View style={[styles.progressIndicator, { width: `${(progress / 5) * 100}%` }]} />
        </View>
        <TouchableOpacity style={styles.audioButton} onPress={() => setAudioStatus(!audioStatus)}>
          <Ionicons name={audioStatus ? 'volume-high' : 'volume-mute'} size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default Introducao;
