import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  useAnimatedValue,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import HomeScreen from "./Screens/HomeScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import ActiveHunts from "./Screens/ActiveHunts";
import CreateHunt from "./Screens/CreateHunt";
import PlannedHunts from "./Screens/PlannedHunts";
import InvitePlayers from "./Screens/InvitePlayers";
import HuntDetails from "./Screens/Huntdetails";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  console.log("isLoggedIn:", isLoggedIn);

  useEffect(() => {
    const checkLogin = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setIsLoggedIn(true);
      }
    };

    checkLogin();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ActiveHunts" component={ActiveHunts} />
          <Stack.Screen name="CreateHunt" component={CreateHunt} />
          <Stack.Screen name="PlannedHunts" component={PlannedHunts} />
          <Stack.Screen name="HuntDetails" component={HuntDetails} />
          <Stack.Screen name="InvitePlayers" component={InvitePlayers} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
