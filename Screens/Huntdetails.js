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
import { View, Text } from "react-native";
import { getHuntById, fetchAllUsers } from "../util/http";

const HuntDetails = ({ route }) => {
  const { huntId } = route.params;
  const [hunt, setHunt] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    const fetchHuntAndUsers = async () => {
      try {
        // Hämta hunt-data
        const huntData = await getHuntById(huntId);
        setHunt(huntData);

        // Hämta alla användare
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

  console.log(userMap[hunt.creator]);

  console.log(userMap[hunt.creator]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30 }}>{hunt.user}</Text>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Tid: {hunt.time}</Text>
      {userMap[hunt.creator] ? (
        <Text style={{ fontSize: 16, color: "gray" }}>
          Skapad av: {userMap[hunt.creator].username}
        </Text>
      ) : (
        <Text>Okänd användare</Text>
      )}
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Deltagare:</Text>
      {invitedUsers.length > 0 ? (
        invitedUsers.map((user, index) => (
          <Text key={index} style={{ fontSize: 16, color: "gray" }}>
            {user.username}
          </Text>
        ))
      ) : (
        <Text style={{ fontSize: 16, color: "gray" }}>Inga deltagare</Text>
      )}
    </View>
  );
};

export default HuntDetails;
