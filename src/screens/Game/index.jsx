import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button, AsyncStorage, Animated, Easing, Vibration } from "react-native";
import { Audio } from "expo-av";
import ConfettiCannon from 'react-native-confetti-cannon';
import styles from "./styles";
// Import sound files
import wrongSound from '../../../assets/wrong.mp3';
import correctSound from '../../../assets/correct.mp3';
import victorySound from '../../../assets/victory.mp3';
import gameOverSound from '../../../assets/gameOver.mp3';

const Game = () => {
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState([]);
  const [health, setHealth] = useState(100);
  const [info, setInfo] = useState([
    { text: "A IA pode melhorar a eficiência, reduzir custos, aumentar a precisão e personalizar experiências.", correct: true },
    { text: "A IA pode levar à perda de empregos devido à automação de tarefas e tomada de decisões.", correct: false },
    { text: "A IA possui a capacidade de funcionar de maneira ininterrupta e realizar tarefas repetitivas.", correct: true },
    { text: "A automação de tarefas e da tomada de decisões pela IA tende a ocasionar desemprego estrutural.", correct: false },
    { text: "A IA pode resultar em melhorias no processo de compra e venda online.", correct: true },
    { text: "A IA tem avanços ilimitados mesmo com maior acúmulo de experiência.", correct: false },
    { text: "A IA apresenta um elevado custo de desenvolvimento e implementação, sendo um recurso restrito.", correct: true },
    { text: "A IA pode criar vieses algorítmicos devido à maneira como os dados são coletados e analisados.", correct: true },
    { text: "A IA pode levantar questões éticas devido ao seu uso e impacto na sociedade.", correct: true },
    { text: "O deep learning utiliza redes neurais para emular o cérebro humano.", correct: false },
    { text: "A IA tem sido criticada por seu potencial de substituir empregos tradicionais por automação.", correct: true },
    { text: "A IA pode ser utilizada para personalizar recomendações de produtos com base no histórico de compras de um usuário.", correct: true },
    { text: "O machine learning é um processo automatizado de reconhecimento e reprodução de padrões pela IA.", correct: true },
    { text: "A IA utiliza algoritmos pré-programados para tomar decisões e realizar tarefas de maneira autônoma.", correct: true },
    { text: "A IA pode melhorar a segurança cibernética ao identificar padrões de comportamento suspeito na rede.", correct: true },
    { text: "A IA pode ser implementada em sistemas de saúde para análise de grandes volumes de dados médicos.", correct: true },
    { text: "A inteligência artificial funciona através da coleta e combinação de um grande volume de dados para identificar padrões.", correct: true },
    { text: "O reconhecimento facial é uma aplicação de IA que se utiliza de algoritmos para identificar rostos.", correct: true },
    { text: "Redes sociais são exemplos de plataformas que utilizam inteligência artificial para análise de dados e personalização de conteúdo.", correct: true },
    { text: "A IA pode contribuir para a previsão de tendências de mercado com base em dados históricos e comportamentais.", correct: true },
    { text: "A IA pode criar vieses éticos devido à maneira como os algoritmos são programados.", correct: false }

  ]);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [sound, setSound] = useState();
  const [bounceValue] = useState(new Animated.Value(1));
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds for each question
  const [hints, setHints] = useState(3); // Initial number of hints
  const [backgroundColor, setBackgroundColor] = useState("#f0f0f0");
  const [selectedStatement, setSelectedStatement] = useState({});
  const [questions, setQuestions] = useState([]);
  const timerRef = useRef(null);
  const cannonRef = useRef(null);

  useEffect(() => {
    // Load high scores from AsyncStorage
    const loadScores = async () => {
      try {
        const savedScores = await AsyncStorage.getItem("highScores");
        if (savedScores !== null) {
          setHighScores(JSON.parse(savedScores));
        }
      } catch (error) {
        console.error("Error loading scores:", error);
      }
    };

    loadScores();

    // Clean up function
    return async () => {
      // Unload sound if it exists
      if (sound) {
        await sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    // Check for game over or victory conditions
    if (health <= 0) {
      setGameOver(true);
      setVictory(false);
      playSound(gameOverSound);
      setBackgroundColor("#ff4c4c");
    }
    if (info.length === 0) {
      setGameOver(true);
      setVictory(true);
      playSound(victorySound);
      setBackgroundColor("#4cff4c");
      if (cannonRef.current) {
        cannonRef.current.start();
      }
    }
  }, [health, info]);

  useEffect(() => {
    // Adjust health based on difficulty
    if (difficulty === 2) {
      setHealth(50);
    } else if (difficulty === 3) {
      setHealth(25);
    }
  }, [difficulty]);

  useEffect(() => {
    // Start or stop timer based on game state
    if (gameOver) {
      clearInterval(timerRef.current);
    } else {
      startTimer();
    }
  }, [gameOver, info]);

  useEffect(() => {
    // Set selected statement when info changes
    setSelectedStatement(info[0]);
  }, [info]);

  useEffect(() => {
    // Set questions when difficulty changes
    setQuestions([...info]);
  }, [difficulty]);

  const startTimer = () => {
    // Start the timer
    setTimeLeft(10);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleTimeout();
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    // Handle timeout
    setHealth((prevHealth) => prevHealth - 10);
    playSound(wrongSound);
    Vibration.vibrate();
  };

  const handleAnswer = (isCorrect) => {
    // Handle user's answer
    if (!gameOver) {
      clearInterval(timerRef.current);
      if (isCorrect === selectedStatement.correct) {
        setScore((prevScore) => prevScore + 10);
        playSound(correctSound);
        setBackgroundColor("#4cff4c");
      } else {
        setHealth((prevHealth) => prevHealth - 20);
        playSound(wrongSound);
        Vibration.vibrate();
        setBackgroundColor("#ff4c4c");
      }
      setInfo((prevInfo) => prevInfo.filter((item) => item !== selectedStatement));
      startTimer();
    }
  };

  const handleRestart = () => {
    // Restart the game
    setScore(0);
    setHealth(100);
    setInfo([...questions]);
    setGameOver(false);
    setVictory(false);
    setBackgroundColor("#f0f0f0");
    
  };

  const playSound = async (soundFile) => {
    // Play sound effect
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    await sound.playAsync();
  };

  const handleDifficultyChange = () => {
    // Change difficulty level
    const newDifficulty = difficulty === 3 ? 1 : difficulty + 1;
    setDifficulty(newDifficulty);
  };

  const handleBounce = () => {
    // Animate bounce effect
    Animated.sequence([
      Animated.timing(bounceValue, { toValue: 1.2, duration: 200, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(bounceValue, { toValue: 1, duration: 200, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  };

  const useHint = () => {
    // Use hint to reveal correct answer
    if (hints > 0) {
      const correctInfo = info.find((infoItem) => infoItem.correct);
      if (correctInfo) {
        const correctIndex = info.indexOf(correctInfo);
        handleAnswer(true);
        setHints(hints - 1);
      }
    }
  };

  const resetScores = () => {
    // Reset high scores
    saveScores([]);
  };

  const renderHighScores = () => {
    // Render high scores
    return highScores.slice(0, 5).map((score, index) => (
      <Text key={index} style={styles.highScoreText}>
        {index + 1}. {score}
      </Text>
    ));
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAnswer(true)}
          disabled={gameOver}
        >
          <Text style={styles.buttonText}>Verdadeiro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAnswer(false)}
          disabled={gameOver}
        >
          <Text style={styles.buttonText}>Falso</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.score}>Pontuação: {score}</Text>
      <Text style={styles.health}>Saúde: {health}%</Text>
      <Text style={styles.timer}>Tempo: {timeLeft}s</Text>
      <Text style={styles.hints}>Dicas: {hints}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Dificuldade" onPress={handleDifficultyChange} />
        <Button title="Usar dica" onPress={useHint} disabled={hints === 0} />
      </View>
      {renderButtons()}
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>{victory ? "Parabéns! Você ganhou!" : "Você perdeu. Tente novamente!"}</Text>
          <Button title="Reiniciar" onPress={handleRestart} />
        </View>
      ) : (
        <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{selectedStatement.text}</Text>
          </View>
        </Animated.View>
      )}{
        victory && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} ref={cannonRef} />
      }
    </View>
  );
};

export default Game;