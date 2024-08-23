import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getUser, updateUserProfileImage } from "../util/http";

const ProfileScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);

  useLayoutEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");

        if (storedUsername) {
          const user = await getUser(storedUsername); 

          if (user) {
            setUsername(user.username);
            setProfileImage(user.profileImageUrl || null);
            setUserId(user.id);
          } else {
            Alert.alert(
              "Användare ej hittad",
              "Kunde inte hämta användardata."
            );
          }
        } else {
          Alert.alert(
            "Ingen användare inloggad",
            "Kunde inte hämta användardata."
          );
        }
      } catch (error) {
        console.error("Fel vid hämtning av användardata:", error);
        Alert.alert("Fel", "Misslyckades med att hämta användardata.");
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Åtkomst nekad",
        "Du måste ge tillåtelse för att komma åt galleriet."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Åtkomst nekad",
        "Du måste ge tillåtelse för att använda kameran."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileImage) {
      Alert.alert("Ingen bild vald", "Vänligen välj eller ta ett foto.");
      return;
    }

    try {
      setUploading(true);
      console.log("User ID som används vid bilduppdatering:", userId);
      // const user = { username };
      await updateUserProfileImage(userId, profileImage);

      Alert.alert("Framgång", "Profilen har uppdaterats framgångsrikt.");
    } catch (error) {
      console.error("Fel vid sparande av profil:", error);
      Alert.alert("Fel", "Ett problem uppstod vid sparande av din profil.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Profil</Text>
    <Text style={styles.username}>Användarnamn: {username}</Text>

    {profileImage ? (
      <Image source={{ uri: profileImage }} style={styles.image} />
    ) : (
      <Image
        source={require("../assets/akkakabotto.png")}
        style={styles.image}
      />
    )}

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Välj bild från Galleri</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Ta ett Foto</Text>
      </TouchableOpacity>
    </View>

    {uploading ? (
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    ) : (
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Spara Profil</Text>
      </TouchableOpacity>
    )}
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  paddingHorizontal: 20,
  backgroundColor: "#9bc39e",
  justifyContent: "center",
},
logo: {
  width: 150,
  height: 150,
  alignSelf: "center",
  marginBottom: 30,
  borderRadius: 75,
},
title: {
  fontSize: 24,
  marginBottom: 10,
  textAlign: "center",
  color: "#275829",
},
username: {
  fontSize: 18,
  marginBottom: 20,
  textAlign: "center",
  color: "#275829",
},
image: {
  width: 200,
  height: 200,
  borderRadius: 100,
  marginBottom: 20,
  alignSelf: "center",
},
buttonContainer: {
  flexDirection: "column",
  alignItems: "center",
  marginVertical: 20,
},
button: {
  backgroundColor: "#2C6B2F", 
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 2,
  marginBottom: 10,
  width: '100%', 
  alignItems: "center",
},
buttonText: {
  color: "#ffffff", 
  fontSize: 16,
  fontWeight: "600",
},
loader: {
  marginTop: 20,
},
});

export default ProfileScreen;
