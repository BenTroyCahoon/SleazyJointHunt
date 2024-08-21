// // import React, { useEffect, useLayoutEffect, useState } from "react";
// // import { View, Text } from "react-native";
// // import { getHuntById } from "../util/http";

// // const HuntDetails = ({ route }) => {
// //   const { huntId } = route.params;
// //   const [hunt, setHunt] = useState(null);

// //   useLayoutEffect(() => {
// //     const loadHuntDetails = async () => {
// //       try {
// //         const huntData = await getHuntById(huntId);
// //         setHunt(huntData);
// //       } catch (error) {
// //         console.error("Error loading hunt details:", error);
// //       }
// //     };

// //     loadHuntDetails();
// //   }, [huntId]);

// //   //   if (!hunt) {
// //   //     return <Text>Loading...</Text>;
// //   //   }
// //   if (hunt) {
// //     return (
// //       <View style={{ flex: 1, padding: 20 }}>
// //         <Text style={{ fontSize: 30 }}>hej</Text>
// //         <Text style={{ fontSize: 20, marginVertical: 10 }}>
// //           Tid: {hunt.time}
// //         </Text>
// //         <Text style={{ fontSize: 20, marginVertical: 10 }}>
// //           Skapad av: {hunt.creator}
// //         </Text>
// //         <Text style={{ fontSize: 18, marginVertical: 10 }}>Deltagare:</Text>
// //             {hunt.invitedUsers.map((user, index) => (
// //             for ( const id in invitedUsers) {
// //                 console.log (invitedUsers[id].username)
// //             }
// //           <Text key={index} style={{ fontSize: 16, color: "gray" }}>
// //             {user}
// //           </Text>
// //         ))}
// //       </View>
// //     );
// //   } else {
// //     return (
// //       <View>
// //         <Text>Vänta lite...</Text>
// //       </View>
// //     );
// //   }
// // };

// // export default HuntDetails;

// // OnGoingHunt.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import { getHuntById } from "../util/http"; // Importera den nödvändiga funktionen

// const OnGoingHunts = ({ route, navigation }) => {
//   const { huntId } = route.params; // Förutsätter att huntId skickas som parameter
//   const [hunt, setHunt] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   console.log(" Heipa");

//   useEffect(() => {
//     console.log(" vad är kartqan");
//     const fetchHuntData = async () => {
//       try {
//         if (!huntId) {
//           throw new Error("Hunt ID saknas.");
//         }
//         const huntData = await getHuntById(huntId);
//         if (huntData) {
//           setHunt(huntData);
//         } else {
//           setError("Jaktdata kunde inte hämtas.");
//         }
//       } catch (error) {
//         console.error("Fel vid hämtning av jaktdata:", error);
//         setError("Fel vid hämtning av jaktdata.");
//       }
//       setLoading(false);
//     };

//     const getCurrentLocation = async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           setError("Behörighet för platsåtkomst beviljades inte.");
//           return;
//         }

//         const location = await Location.getCurrentPositionAsync({});
//         setCurrentLocation(location.coords);
//       } catch (error) {
//         console.error("Fel vid hämtning av aktuell plats:", error);
//         setError("Fel vid hämtning av aktuell plats.");
//       }
//     };

//     fetchHuntData();
//     getCurrentLocation();
//   }, [huntId]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Laddar...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Fel: {error}</Text>
//       </View>
//     );
//   }

//   if (!hunt) {
//     return (
//       <View style={styles.container}>
//         <Text>Ingen jaktdata hittades.</Text>
//       </View>
//     );
//   }

//   const initialRegion = {
//     latitude: currentLocation
//       ? currentLocation.latitude
//       : hunt.startPoint.latitude,
//     longitude: currentLocation
//       ? currentLocation.longitude
//       : hunt.startPoint.longitude,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={initialRegion}
//         showsUserLocation={true} // Visar användarens position om platsåtkomst beviljas
//       >
//         {hunt.markers.map((marker, index) => (
//           <Marker
//             key={index}
//             coordinate={{
//               latitude: marker.latitude,
//               longitude: marker.longitude,
//             }}
//             title={marker.title || `Marker ${index + 1}`}
//             description={
//               marker.description || `Description for marker ${index + 1}`
//             }
//           />
//         ))}
//         {currentLocation && (
//           <Marker
//             coordinate={currentLocation}
//             title="Din Position"
//             description="Du är här"
//             pinColor="blue"
//           />
//         )}
//       </MapView>
//       <Button
//         title="Avsluta Jakten"
//         onPress={() => navigation.goBack()} // Eller annan logik för att avsluta jakten
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height * 0.8,
//   },
// });

// export default OnGoingHunts;

const OnGoingHunts = ({ route }) => {
  return (
  <View>
    <Text>HEJ</Text>
  </View>
  )
};

export default OnGoingHunts;
