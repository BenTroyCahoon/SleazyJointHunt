import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ navigation, route }) => {
    const { huntName, estimatedTime, iconUri } = route.params;
    const [markers, setMarkers] = useState([]);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);

    const handleMapPress = (e) => {
        const { coordinate } = e.nativeEvent;

        if (!startPoint) {
            setStartPoint(coordinate);
            Alert.alert("Start point set!");
        } else if (!endPoint) {
            setEndPoint(coordinate);
            Alert.alert("End point set!");
        } else {
            setMarkers([...markers, coordinate]);
        }
    };

    const handleContinue = () => {
        if (!startPoint || !endPoint) {
            Alert.alert("Please set both a start and end point.");
            return;
        }

        navigation.navigate("InvitePlayers", {
            huntName,
            estimatedTime,
            iconUri,
            startPoint,
            endPoint,
            markers,
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                onPress={handleMapPress}
                initialRegion={{
                    latitude: 57.7089, // Latitude för Göteborg
                    longitude: 11.9746, // Longitude för Göteborg
                    latitudeDelta: 0.0922, // Zoomnivå
                    longitudeDelta: 0.0421, // Zoomnivå
                }}
            >
                {startPoint && (
                    <Marker coordinate={startPoint} pinColor="green" title="Start" />
                )}
                {endPoint && (
                    <Marker coordinate={endPoint} pinColor="red" title="End" />
                )}
                {markers.map((marker, index) => (
                    <Marker key={index} coordinate={marker} pinColor="blue" />
                ))}
            </MapView>
            <Button title="Continue" onPress={handleContinue} />
        </View>
    );
};

export default MapScreen;
