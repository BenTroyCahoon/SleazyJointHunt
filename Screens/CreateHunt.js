import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

const CreateHunt = ({ navigation }) => {
  const [huntName, setHuntName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [iconUri, setIconUri] = useState(null);
  const [description, setDescription] = useState('')

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      permissionResult.granted === false ||
      libraryPermissionResult.granted === false
    ) {
      Alert.alert("Permission to access camera roll and camera is required!");
      return;
    }

    Alert.alert(
      "Select Image Source",
      "Choose an option to add an icon for your Hunt:",
      [
        {
          text: "Camera",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setIconUri(result.assets[0].uri);
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setIconUri(result.assets[0].uri);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleContinue = () => {
    if (!huntName || !estimatedTime || !iconUri || !description) {
      Alert.alert("Please fill in all fields and select an icon.");
      return;
    }

    navigation.navigate("MapScreen", { huntName, estimatedTime, iconUri, description });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleImagePicker}
        style={styles.imagePicker}
      >
        <View style={styles.imageContainer}>
          {iconUri ? (
            <Image
              source={{ uri: iconUri }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.imageText}>Insert Image</Text>
          )}
        </View>
      </TouchableOpacity>

      <TextInput
        placeholder="Huntens namn"
        value={huntName}
        onChangeText={setHuntName}
        style={styles.input}
      />
      <TextInput
        placeholder="Uppskattad tid"
        value={estimatedTime}
        onChangeText={setEstimatedTime}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Beskrivning"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Fortsätt" onPress={handleContinue} color="#2C6B2F" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9bc39e",
    justifyContent: "center"
  },
  customizeInput: {
    height: 100,
    fontSize: 24,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlignVertical: 'top',
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  imagePicker: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  imageText: {
    color: "#666",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  }
});

export default CreateHunt;
