import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'

import { getUser } from "../util/http";

const CreateHunt = ({ navigation }) => {
    const [huntName, setHuntName] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [iconUri, setIconUri] = useState(null);

    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        const libraryPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();


        if (permissionResult.granted === false || libraryPermissionResult.granted === false) {
            Alert.alert("Permission to access camera roll and camera is required!");
            return;
        }

        // Välj mellan att öppna kameran eller galleriet
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
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const handleContinue = () => {
        if (!huntName || !estimatedTime || !iconUri) {
            Alert.alert("Please fill in all fields and select an icon.");
            return;
        }

        // Logik för att spara "Hunt" och navigera till nästa sida
        // console.log('Hunt Created:', { huntName, estimatedTime, iconUri });
        navigation.navigate('InvitePlayers', { huntName, estimatedTime, iconUri });
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Customize"
                style={{ height: 100, fontSize: 50 }}
            />
            <TextInput
                placeholder="Hunt Name"
                value={huntName}
                onChangeText={setHuntName}
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
            />
            <TextInput
                placeholder="Estimated Time ( in hours )"
                value={estimatedTime}
                onChangeText={setEstimatedTime}
                keyboardType="numeric"
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
            />

            <TouchableOpacity onPress={handleImagePicker} style={{ marginBottom: 20 }}>
                <View style={{ height: 100, width: 100, borderWidth: 1, borderColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                    {iconUri ? (
                        <Image source={{ uri: iconUri }} style={{ height: 100, width: 100 }} />
                    ) : (
                        <Text>Insert Image</Text>
                    )}
                </View>
            </TouchableOpacity>

            <Button title="Continue" onPress={handleContinue} />
        </View>
    );
};


export default CreateHunt;


// const CreateHunt = ({ navigation }) => {

//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>CreateHunt är här!</Text>
//       </View>
//     );
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "center",
//       paddingHorizontal: 20,
//     },
//     title: {
//       fontSize: 24,
//       marginBottom: 20,
//       textAlign: "center",
//     },
//   });

