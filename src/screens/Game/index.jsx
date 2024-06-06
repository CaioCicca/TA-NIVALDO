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
  const timerRef = useRef(null);
  const cannonRef = useRef(null);

  useEffect(() => {
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

    return async () => {
      if (sound) {
        await sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
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
    if (difficulty === 2) {
      setHealth(50);
    } else if (difficulty === 3) {
      setHealth(25);
    }
  }, [difficulty]);

  useEffect(() => {
    if (gameOver) {
      clearInterval(timerRef.current);
    } else {
      startTimer();
    }
  }, [gameOver, info]);

  const startTimer = () => {
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
    setHealth((prevHealth) => prevHealth - 10);
    playSound(wrongSound);
    Vibration.vibrate();
  };

  const handleInfoClick = async (index) => {
    if (!gameOver) {
      const selectedInfo = info[index];
      clearInterval(timerRef.current);
      if (!selectedInfo.correct) {
        setHealth((prevHealth) => prevHealth - 20);
        await playSound(wrongSound);
        Vibration.vibrate();
        setBackgroundColor("#ff4c4c");
      } else {
        setScore((prevScore) => prevScore + 10);
        await playSound(correctSound);
        setBackgroundColor("#4cff4c");
      }
      setInfo((prevInfo) => {
        const newInfo = [...prevInfo];
        newInfo.splice(index, 1);
        return newInfo;
      });
      startTimer();
    }
  };

  const handleRestart = () => {
    setScore(0);
    setHealth(100);
    setInfo([
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
    setGameOver(false);
    setVictory(false);
    setHints(3);
    setBackgroundColor("#f0f0f0");
    startTimer();
  };

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    await sound.playAsync();
  };

  const saveScores = async (newScores) => {
    try {
      await AsyncStorage.setItem("highScores", JSON.stringify(newScores));
      setHighScores(newScores);
    } catch (error) {
      console.error("Error saving scores:", error);
    }
  };

  const handleDifficultyChange = () => {
    const newDifficulty = difficulty === 3 ? 1 : difficulty + 1;
    setDifficulty(newDifficulty);
  };

  const handleBounce = () => {
    Animated.sequence([
      Animated.timing(bounceValue, { toValue: 1.2, duration: 200, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(bounceValue, { toValue: 1, duration: 200, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  };

  const useHint = () => {
    if (hints > 0) {
      const correctInfo = info.find((infoItem) => infoItem.correct);
      if (correctInfo) {
        const correctIndex = info.indexOf(correctInfo);
        handleInfoClick(correctIndex);
        setHints(hints - 1);
      }
    }
  };

  const resetScores = () => {
    saveScores([]);
  };

  const renderHighScores = () => {
    return highScores.slice(0, 5).map((score, index) => (
      <Text key={index} style={styles.highScoreText}>
        {index + 1}. {score}
      </Text>
    ));
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
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>{victory ? "Parabéns! Você ganhou!" : "Você perdeu. Tente novamente!"}</Text>
          <Text style={styles.highScoreTitle}>Pontuações mais altas:</Text>
          {renderHighScores()}
          <Button title="Reiniciar" onPress={handleRestart} />
          <Button title="Resetar pontuações" onPress={resetScores} />
        </View>
      ) : (
        <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
          <View style={styles.infoContainer}>
            {info.map((infoItem, index) => (
              <TouchableOpacity
                key={index}
                style={styles.infoButton}
                onPress={() => {
                  handleInfoClick(index);
                  handleBounce();
                }}
              >
                <Text style={styles.infoText}>{infoItem.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
      <ConfettiCannon ref={cannonRef} count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  health: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timer: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  hints: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  infoContainer: {
    width: "80%",
  },
  infoButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 18,
  },
  gameOverContainer: {
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 24,
    marginBottom: 10,
  },
  highScoreTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  highScoreText: {
    fontSize: 18,
  },
});

export default Game;