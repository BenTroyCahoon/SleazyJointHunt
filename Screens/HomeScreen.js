import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeUser, getUser } from "../util/http"; 

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error logging out: ', error.message);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Logga ut"
          onPress={handleLogout}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WOOOHOOO hemskärmen är här!</Text>
      <Button title="profile" onPress={() => navigation.navigate("Profile")} />
      <Button
        title="Active Hunts"
        onPress={() => navigation.navigate("ActiveHunts")}
      />
      <Button
        title="Planned Hunts"
        onPress={() => navigation.navigate("PlannedHunts")}
      />
      <Button
        title="Create Hunt"
        onPress={() => navigation.navigate("CreateHunt")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default HomeScreen;
