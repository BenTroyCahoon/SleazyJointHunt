// import React, { useState, useEffect } from "react";
// import { StyleSheet, Text, View, Button, TextInput, ScrollView, CheckBox, Alert } from "react-native";
// import { fetchAllUsers } from "../util/http";

// const InvitePlayers = ({ navigation, route }) => {
//     const { huntName, estimatedTime, iconUri } = route.params
//     const [users, setUsers] = useState([]);
//     const [selectedUsers, setSelectedUsers] = useState({});

//     //useEffect(() => {
//         //     const fetchUsers = async () => {
//         //         const fetchedUsers = await fetchAllUsers();
//         //         if (fetchedUsers) {
//         //             setUsers(Object.keys(fetchedUsers).map(key => ({
//         //                 id: key,
//         //                 username: fetchedUsers[key].username
//         //             })));
//         //         }
//         //     };
//         //     console.log('jdskk')
//         //     fetchUsers();
//         // }, []);

//         useEffect(() => {
//             const fetchUsers = async () => {
//                 const users = await fetchAllUsers();
//                 if (users) {
//                     // Loopar genom alla användare och loggar deras användarnamn i konsolen
//                     Object.keys(users).forEach(key => {
//                         console.log(users[key].username);
//                     });
//                 } else {
//                     console.log("No users found");
//                 }
//             };

//             fetchUsers();
//         }, []);

//         const handleCheckboxChange = (userId) => {
//             setSelectedUsers(prevState => ({
//                 ...prevState,
//                 [userId]: !prevState[userId]
//             }));
//         };

//         const handleCreate = () => {
//             console.log('nu ska allt sparas i databasen på nått vis')
//             const invitedUsers = users.filter(user => selectedUsers[user.id]);
//             // console.log('Invited Users:', invitedUsers);
//             // Lägg till logik för att spara Hunt och de inbjudna användarna
//             Alert.alert('Hunt Created!', `Invited ${invitedUsers.length} users`);
//         };


//         return (
//             <View style={{ padding: 20 }}>
//                 <Text style={{ fontSize: 24 }}>Invite some friends</Text>
//                 <ScrollView>
//                     {users.map(user => (
//                         <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//                             <CheckBox
//                                 value={!!selectedUsers[user.id]}
//                                 onValueChange={() => handleCheckboxChange(user.id)}
//                             />
//                             <Text style={{ marginLeft: 10 }}>{user.username}</Text>
//                         </View>
//                     ))}
//                 </ScrollView>
//                 <Button title="Create Hunt!" onPress={handleCreate} />
//             </View>
//         )
//     }

// export default InvitePlayers;



import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { fetchAllUsers } from "../util/http";

const InvitePlayers = () => {
    const [usernames, setUsernames] = useState([]);
 
    useEffect(() => {
        const fetchUsers = async () => {
            const users = await fetchAllUsers();
            if (users) {
                const names = Object.keys(users).map(key => users[key].username);
                setUsernames(names);
            } else {
                console.log("No users found");
            }
        };
    
        fetchUsers();
    }, []);
    

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24 }}>Invite Players</Text>
            <FlatList
                data={usernames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={{ fontSize: 18 }}>{item}</Text>
                )}
            />
        </View>
    );
};

export default InvitePlayers;
