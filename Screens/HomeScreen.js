import React, { useEffect, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Alert, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    const areyouloggedin = async () => {
      const userName = await AsyncStorage.getItem("username");
      const userid = await AsyncStorage.getItem("userid");

      if (userName === null) {
        navigation.navigate("Login");
      }
    };
    areyouloggedin();
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error logging out: ", error.message);
    }
  };

  useEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logga ut</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ActiveHunts")}
      >
        <Text style={styles.buttonText}>Aktiva Hunts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PlannedHunts")}
      >
        <Text style={styles.buttonText}>Planerade Hunts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CreateHunt")}
      >
        <Text style={styles.buttonText}>Skapa Hunt</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MedalsScreen")}
      >
        <Text style={styles.buttonText}>Medaljer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9bc39e",
    justifyContent: "center",
  },
  logo: {
    width: 300, // Justera bredden efter behov
    height: 300, // Justera höjden efter behov
    alignSelf: "center",
    borderRadius: 150, // Justera tillräckligt för att vara rund
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#275829", // Knappens bakgrundsfärg
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3, // Skugga för knappen
  },
  buttonText: {
    color: "#FFFFFF", // Textfärg på knappen
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#275829", // Bakgrundsfärg för knappen
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#FFFFFF", // Textfärg
    fontSize: 16,
    fontWeight: "bold",
  }
});



export default HomeScreen;
