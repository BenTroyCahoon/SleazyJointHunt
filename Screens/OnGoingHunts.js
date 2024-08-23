import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { getHuntById, updateHuntStatus } from "../util/http"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnGoingHunts = ({ route, navigation }) => {
  const [huntDetails, setHuntDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedMarkers, setCompletedMarkers] = useState([]);
  const [userid, setUserid] = useState("")

  const { huntId } = route.params;

  useEffect(() => {
    const fetchHuntDetails = async () => {
      try {
        const details = await getHuntById(huntId);
        console.log('detaljs: ', details.invitedUsers)
        setHuntDetails(details);
      } catch (err) {
        setError("Kunde inte hämta jaktens detaljer.");
        console.error("Error fetching hunt details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHuntDetails();
  }, [huntId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userid")
        console.log('userId med asynkStorage:', userId)
        setUserid(userId)
      } catch (err) {
        setError("Kunde inte hämta användarend ID.");
        console.error("Error fetching user ID:", err); 
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    return (
      cameraStatus.status === "granted" &&
      mediaLibraryStatus.status === "granted"
    );
  };

  const handleMarkerPress = async (index) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert("Behörighet", "Kameraåtkomst är inte tillåten.");
      return;
    }

    Alert.alert("Ta ett foto", "Vill du ta ett foto vid denna plats?", [
      { text: "Avbryt", style: "cancel" },
      { text: "Ja", onPress: async () => await takePicture(index) },
    ]);
  };

  const takePicture = async (index) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;

        if (typeof photoUri === "string") {
          await MediaLibrary.createAssetAsync(photoUri);
          Alert.alert("Foto tagits", "Bilden har sparats i din fotogalleri.");

          setCompletedMarkers([...completedMarkers, index]);

          if (
            completedMarkers.length + 1 ===
            (huntDetails.places.markers
              ? huntDetails.places.markers.length
              : 0) +
            2
          ) {
            console.log("huntDetails", huntDetails);

            const newInvitedUsers = huntDetails.invitedUsers.map((invited) => {
              if (invited.id === userid) { 
                console.log('JAAAAAAAA');
                return { ...invited, completed: true }; 
              } else {
                return invited; 
              }
            });
            
            huntDetails.invitedUsers = newInvitedUsers;
            
            await updateHuntStatus(huntId, huntDetails);
          
            Alert.alert("Jakt Avslutad!", "Grattis! Du har slutfört jakten.", [
              {
                text: "Tillbaka till Hemskärmen",
                onPress: () => navigation.navigate("Home"),
              },
            ]);
          }
        } else {
          Alert.alert("Fel", "Ogiltig URI för bilden.");
        }
      } else {
        Alert.alert("Avbruten", "Bildtagning avbröts.");
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Fel", "Kunde inte ta bilden.");
    }
  };

  const isMarkerCompleted = (index) => {
    return completedMarkers.includes(index);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Laddar jaktens detaljer...</Text>
      </View>
    );
  }

  if (error || !huntDetails) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Fel: {error || "Jaktens detaljer kunde inte hämtas."}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: huntDetails.places.startPoint.latitude,
          longitude: huntDetails.places.startPoint.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={huntDetails.places.startPoint}
          pinColor={isMarkerCompleted("start") ? "gray" : "green"}
          title={isMarkerCompleted("start") ? "Start avklarad" : "Start"}
          onPress={() => handleMarkerPress("start")}
        />
        <Marker
          coordinate={huntDetails.places.endPoint}
          pinColor={isMarkerCompleted("end") ? "gray" : "red"}
          title={isMarkerCompleted("end") ? "Slut avklarad" : "Slut"}
          onPress={() => handleMarkerPress("end")}
        />
        {huntDetails.places.markers &&
          huntDetails.places.markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              pinColor={isMarkerCompleted(index) ? "gray" : "blue"}
              onPress={() => handleMarkerPress(index)}
              title={isMarkerCompleted(index) ? "Avklarad" : "Marker"}
            />
          ))}
      </MapView>

      <Button
        title="Avbryt Jakt"
        onPress={() => {
          Alert.alert("Jakt Avbruten");
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default OnGoingHunts;
