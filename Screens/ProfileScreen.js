import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { storeUser, getUser, updateUserProfileImage } from "../util/http"; 

const ProfileScreen = ({ route, navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);

  //const { currentUsername } = route.params || {};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        // console.log('username: ', userName);
        
        if (storedUsername) {storedUsername
          const user = await getUser(storedUsername); // Använd await här
          if (user) {
            // console.log("Användardata hämtad:", user);
            setUsername(user.username);
            setProfileImage(user.profileImageUrl || null);
            setUserId(user.id)

          } else {
            Alert.alert("Användare ej hittad", "Kunde inte hämta användardata.");
          }
        } else {
          Alert.alert("Ingen användare inloggad", "Kunde inte hämta användardata.");
        }
      } catch (error) {
        console.error("Fel vid hämtning av användardata:", error);
        Alert.alert("Fel", "Misslyckades med att hämta användardata.");
      }
    };

    fetchUserData();
  }, []);
  


  // useEffect(() => {
  //   const fetchUserData = async () => {
     
      //if (currentUsername) return;
  //     try { 
  //       //const user = await getUser(currentUsername);
  //       const userName = await AsyncStorage.getItem("username")
  //       console.log('userName: ', userName)
  //       console.log('username:', username)
  //       const user = getUser(userName)
  //       if (user) {
  //         console.log("Användardata hämtad:", user); // Logga användardata
  //         setUsername(user.username);
  //         setProfileImage(user.profileImageUrl || null);
  //       } else {
  //         Alert.alert("Användare ej hittad", "Kunde inte hämta användardata.");
  //       }
  //     } catch (error) {
  //       console.error("Fel vid hämtning av användardata:", error);
  //       Alert.alert("Fel", "Misslyckades med att hämta användardata.");
  //     }
  //   };

  //   fetchUserData();
  // }, []);



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
      console.log('User ID som används vid bilduppdatering:', userId);
      const user = { username };
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

      <View>
        <Text style={styles.username}>Användarnamn: {username}</Text>

        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Image
            source={require("../assets/akkakabotto.png")} // Se till att denna fil finns
            style={styles.image}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button title="Välj bild från Galleri" onPress={pickImage} />
          <Button title="Ta ett Foto" onPress={takePhoto} />
        </View>

        {uploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Spara Profil" onPress={handleSaveProfile} />
        )}
      </View>
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
  username: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default ProfileScreen;
