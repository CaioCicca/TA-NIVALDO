import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Category from "../screens/Category";
import Game from "../screens/Game";
import Introducao from "../screens/Introducao";

const Stack = createNativeStackNavigator();

const StackRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Game" component={Game} />
      <Stack.Screen name="Introducao" component={Introducao} />
    </Stack.Navigator>
  );
};

export default StackRoutes;
