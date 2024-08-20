// import React, { useEffect, useLayoutEffect, useState } from "react";
// import { View, Text } from "react-native";
// import { getHuntById } from "../util/http";

// const HuntDetails = ({ route }) => {
//   const { huntId } = route.params;
//   const [hunt, setHunt] = useState(null);

//   useLayoutEffect(() => {
//     const loadHuntDetails = async () => {
//       try {
//         const huntData = await getHuntById(huntId);
//         setHunt(huntData);
//       } catch (error) {
//         console.error("Error loading hunt details:", error);
//       }
//     };

//     loadHuntDetails();
//   }, [huntId]);

//   //   if (!hunt) {
//   //     return <Text>Loading...</Text>;
//   //   }
//   if (hunt) {
//     return (
//       <View style={{ flex: 1, padding: 20 }}>
//         <Text style={{ fontSize: 30 }}>hej</Text>
//         <Text style={{ fontSize: 20, marginVertical: 10 }}>
//           Tid: {hunt.time}
//         </Text>
//         <Text style={{ fontSize: 20, marginVertical: 10 }}>
//           Skapad av: {hunt.creator}
//         </Text>
//         <Text style={{ fontSize: 18, marginVertical: 10 }}>Deltagare:</Text>
//             {hunt.invitedUsers.map((user, index) => (
//             for ( const id in invitedUsers) {
//                 console.log (invitedUsers[id].username)
//             }
//           <Text key={index} style={{ fontSize: 16, color: "gray" }}>
//             {user}
//           </Text>
//         ))}
//       </View>
//     );
//   } else {
//     return (
//       <View>
//         <Text>Vänta lite...</Text>
//       </View>
//     );
//   }
// };

// export default HuntDetails;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getHuntById, fetchAllUsers } from "../util/http";

const HuntDetails = ({ route }) => {
  const { huntId } = route.params;
  const [hunt, setHunt] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    const fetchHuntAndUsers = async () => {
      try {
        const huntData = await getHuntById(huntId);
        setHunt(huntData);

        const allUsers = await fetchAllUsers();

        // Skapa en map av användare för snabb uppslagning
        const usersMap = allUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUserMap(usersMap);

        // Hämta detaljerna om inbjudna användare
        const huntInvitedUsers = huntData.invitedUsers.map(
          (userId) => usersMap[userId]
        );

        setInvitedUsers(huntInvitedUsers);
      } catch (error) {
        console.error("Error fetching hunt details:", error);
      }
    };

    fetchHuntAndUsers();
  }, [huntId]);

  if (!hunt) {
    return (
      <View>
        <Text>Loading hunt details...</Text>
      </View>
    );
  }

  const { places, huntImageUrl, name, time } = hunt;
  const { startpoint, markers } = places;

  // console.log('creator',userMap[hunt.creator]);

  // // ÄNDRA OM VI LÖSER GPS
  // const initialRegion = {
  //   latitude: 57.7089, // Latitude för Göteborg
  //   longitude: 11.9746, // Longitude för Göteborg
  //   latitudeDelta: 0.0922, // Zoomnivå
  //   longitudeDelta: 0.0421, // Zoomnivå
  // };

  return (
    //     <View style={{ padding: 20 }}>
    //       <Text style={{ fontSize: 30 }}>{hunt.user}</Text>
    //       <Text style={{ fontSize: 20, marginBottom: 10 }}>Tid: {hunt.time}</Text>
    //       {userMap[hunt.creator] ? (
    //         <Text style={{ fontSize: 16, color: "gray" }}>
    //           Skapad av: {userMap[hunt.creator].username}
    //         </Text>
    //       ) : (
    //         <Text>Okänd användare</Text>
    //       )}
    //       <Text style={{ fontSize: 18, marginVertical: 10 }}>Deltagare:</Text>
    //       {invitedUsers.length > 0 ? (
    //         invitedUsers.map((user, index) => (
    //           <Text key={index} style={{ fontSize: 16, color: "gray" }}>
    //             {user.username}
    //           </Text>
    //         ))
    //       ) : (
    //         <Text style={{ fontSize: 16, color: "gray" }}>Inga deltagare</Text>
    //       )}
    //     </View>
    //   );
    // };

    <View style={styles.container}>
      <Image source={{ uri: hunt.huntImageUrl }} style={styles.image} />
      <Text style={styles.title}>{hunt.name}</Text>
      <Text style={styles.time}>Tid: {hunt.time}</Text>
      <Text style={styles.creator}>
        Skapad av: {userMap[hunt.creator]?.username || "Okänd skapare"}
      </Text>
      <Text style={styles.subtitle}>Deltagare:</Text>
      {invitedUsers.length > 0 ? (
        <FlatList
          data={invitedUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.invitedUser}>{item.username}</Text>
          )}
        />
      ) : (
        <Text style={styles.user}>Inga deltagare</Text>
      )}
      <View style={styles.subtitle}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: startpoint.latitude,
            longitude: startpoint.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={startpoint} title="Startpunkt" />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              title={`Marker ${index + 1}`}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5", // Bakgrundsfärg för hela skärmen
  },
  image: {
    width: "100%",
    height: 200, // Sätt ett fast höjd för bilden
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  time: {
    fontSize: 20,
    color: "gray",
    marginBottom: 10,
  },
  creator: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  user: {
    fontSize: 16,
    color: "gray",
  },
  map: {
    width: "100%",
    height: 300, // Sätt ett fast höjd för kartan
    borderRadius: 10,
    marginTop: 15,
  },
});

export default HuntDetails;
