import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { getUser } from "../util/http";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await getUser(username);
      if (user && user.password === password) {
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("userid", user.id);
        console.log('inloggad id: ', user.id)

        navigation.navigate("Home");
      } else {
        Alert.alert("Login Failed", "User not found");
      }
    } catch (error) {
      Alert.alert("Error logging in:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />

      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#9bc39e", 
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    color: "#275829", 
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#275829",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333", 
    backgroundColor: "#f2f2f2", 
  },
  button: {
    backgroundColor: "#275829", 
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF", 
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#4CAF50", 
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF", 
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    width: 300, 
    height: 300,
    alignSelf: "center",
    borderRadius: 150,
    marginBottom: 30,
  },
});

export default LoginScreen;
