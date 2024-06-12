import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated, Vibration, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useNavigation } from "@react-navigation/native";

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
        textToRead = 'Benefícios da IA. A IA pode melhorar a eficiência, reduzir custos, aumentar a precisão e personalizar experiências.';
        break;
      case 'Desvantagens':
        textToRead = 'Desvantagens da IA. A IA pode levar à perda de empregos, criar vieses algorítmicos, e levantar questões éticas.';
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
            <Text style={styles.text}>A IA pode melhorar a eficiência, reduzir custos, aumentar a precisão e personalizar experiências.</Text>
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
            <Text style={styles.text}>A IA pode levar à perda de empregos, criar vieses algorítmicos, e levantar questões éticas.</Text>
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
          <View style={[styles.progressIndicator, { width: `${(progress / 3) * 100}%` }]} />
        </View>
        <TouchableOpacity style={styles.audioButton} onPress={() => setAudioStatus(!audioStatus)}>
          <Ionicons name={audioStatus ? 'volume-high' : 'volume-mute'} size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = {
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  progressBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
  },
  progressIndicator: {
    height: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  audioButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
};

export default Introducao;