import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button, AsyncStorage, Animated, Easing } from "react-native";
import { Audio } from "expo-av";

const Game = () => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [info, setInfo] = useState([
    "Vacinas são seguras e eficazes.",
    "Exercícios regulares são importantes para a saúde.",
    "Mantenha uma dieta equilibrada para se manter saudável.",
    "Notícias falsas podem causar danos à saúde.",
    "Consulte um médico antes de confiar em informações de saúde.",
    "Beber água regularmente é essencial para o corpo humano.",
    "Dormir o suficiente é crucial para o bem-estar.",
    "Cuidado com remédios caseiros não comprovados cientificamente.",
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [sound, setSound] = useState();
  const [bounceValue] = useState(new Animated.Value(1));

  useEffect(() => {
    const loadScore = async () => {
      try {
        const savedScore = await AsyncStorage.getItem("highScore");
        if (savedScore !== null) {
          setHighScore(parseInt(savedScore));
        }
      } catch (error) {
        console.error("Error loading score:", error);
      }
    };

    loadScore();

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
    }
    if (info.length === 0) {
      setGameOver(true);
      setVictory(true);
    }
  }, [health, info]);

  useEffect(() => {
    if (difficulty === 2) {
      setHealth(50);
    } else if (difficulty === 3) {
      setHealth(25);
    }
  }, [difficulty]);

  const handleInfoClick = async (index) => {
    if (!gameOver) {
      const selectedInfo = info[index];
      if (selectedInfo.includes("falsas")) {
        setHealth((prevHealth) => prevHealth - 20);
        playSound(require("./assets/wrong.mp3"));
      } else {
        setScore((prevScore) => prevScore + 10);
        playSound(require("./assets/correct.mp3"));
      }
      setInfo((prevInfo) => {
        const newInfo = [...prevInfo];
        newInfo.splice(index, 1);
        return newInfo;
      });
    }
  };

  const handleRestart = () => {
    setScore(0);
    setHealth(100);
    setInfo([
      "Vacinas são seguras e eficazes.",
      "Exercícios regulares são importantes para a saúde.",
      "Mantenha uma dieta equilibrada para se manter saudável.",
      "Notícias falsas podem causar danos à saúde.",
      "Consulte um médico antes de confiar em informações de saúde.",
      "Beber água regularmente é essencial para o corpo humano.",
      "Dormir o suficiente é crucial para o bem-estar.",
      "Cuidado com remédios caseiros não comprovados cientificamente.",
    ]);
    setGameOver(false);
    setVictory(false);
  };

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    await sound.playAsync();
  };

  const saveScore = async (newScore) => {
    try {
      await AsyncStorage.setItem("highScore", newScore.toString());
    } catch (error) {
      console.error("Error saving score:", error);
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

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Pontuação: {score}</Text>
      <Text style={styles.health}>Saúde: {health}%</Text>
      <View style={styles.buttonContainer}>
        <Button title="Dificuldade" onPress={handleDifficultyChange} />
      </View>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>{victory ? "Parabéns! Você ganhou!" : "Você perdeu. Tente novamente!"}</Text>
          <Text style={styles.highScore}>Pontuação mais alta: {highScore}</Text>
          <Button title="Reiniciar" onPress={handleRestart} />
        </View>
      ) : (
        <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
          <View style={styles.infoContainer}>
            {info.map((infoText, index) => (
              <TouchableOpacity
                key={index}
                style={styles.infoButton}
                onPress={() => {
                  handleInfoClick(index);
                  handleBounce();
                }}
              >
                <Text style={styles.infoText}>{infoText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  health: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
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
    fontSize: 16,
  },
  gameOverContainer: {
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 20,
    marginBottom: 10,
  },
  highScore: {
    marginBottom: 20,
  },
});

export default Game;
