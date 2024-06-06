import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#333333"
  },
  header:{
    backgroundColor:"black",
    display:"flex",
    flexDirection:"row",
    gap: 10,
    alignItems:"center",
    padding:14,
    width:400,
    top:-360
  },
  titulo:{
    fontSize:30,
    fontWeight:"bold",
    color:"#F60100"
  },
  foto:{
    width:70,
    height:70
  }
});

export default styles;
