import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity,  } from "react-native";
import { storeUser } from "../util/http";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const RegisterHandler = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match!");
      return;
    }

    const user = { email, username, password,  };

    try {
      await storeUser(user);
      Alert.alert("Registration successful!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error storing user:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={RegisterHandler}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backButtonText}>Back to Login</Text>
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
  backButton: {
    backgroundColor: "#4CAF50", 
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF", 
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RegisterScreen;