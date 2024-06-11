import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button, AsyncStorage, Animated, Easing, Vibration } from "react-native";
import { Audio } from "expo-av";
import ConfettiCannon from 'react-native-confetti-cannon';

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
    { text: "Vacinas são seguras e eficazes.", correct: true },
    { text: "Exercícios regulares são importantes para a saúde.", correct: true },
    { text: "Mantenha uma dieta equilibrada para se manter saudável.", correct: true },
    { text: "Notícias falsas podem causar danos à saúde.", correct: true },
    { text: "Consulte um médico antes de confiar em informações de saúde.", correct: true },
    { text: "Beber água regularmente é essencial para o corpo humano.", correct: true },
    { text: "Dormir o suficiente é crucial para o bem-estar.", correct: true },
    { text: "Cuidado com remédios caseiros não comprovados cientificamente.", correct: true },
    { text: "O sol gira ao redor da Terra.", correct: false },
    { text: "Beber café desidrata.", correct: false },
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