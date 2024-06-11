import { StyleSheet } from "react-native-web";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000000",
    },
    score: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#f2f2f2",
    },
    health: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#f2f2f2",
    },
    timer: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#f2f2f2",
    },
    hints: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#f2f2f2",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginBottom: 20,
    },
    button: {
      backgroundColor: "#e0e0e0",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      width: "48%",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 18,
    },
    gameOverContainer: {
      alignItems: "center",
    },
    gameOverText: {
      fontSize: 24,
      marginBottom: 10,
      color: "#f2f2f2",
    },
    highScoreTitle: {
      fontSize: 20,
      marginBottom: 10,
      color: "#f2f2f2",
    },
    highScoreText: {
      fontSize: 18,
      color: "#f2f2f2",
    },
  });

  export default styles;