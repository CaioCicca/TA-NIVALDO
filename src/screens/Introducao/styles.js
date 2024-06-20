import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f0f0f0",
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
      image: {
        width: "100%",
        height: 200,
        marginBottom: 20,
      },
      menuButton: {
      progressBar: {
        position: "absolute",
        top: 20,
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
      },}
    });

    export default styles;