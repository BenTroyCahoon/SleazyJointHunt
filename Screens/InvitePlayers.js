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
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { CheckBox } from 'react-native-elements';
import { fetchAllUsers, storeHunt } from "../util/http";

const InvitePlayers = ({ navigation }) => {
    // const [usernames, setUsernames] = useState([]);
    const [users, setUsers] = useState([]); // Håller reda på användardata
    const [selectedUsers, setSelectedUsers] = useState({}); // Håller reda på valda användare
    const [huntName, setHuntName] = useState("");
    const [huntTime, setHuntTime] = useState("");
    const [huntImage, setHuntImage] = useState(""); // Du kan senare ersätta detta med faktisk bildval


    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await fetchAllUsers();
            //console.log("Fetched users data:", usersData);
            
            if (usersData) {
                // Filtrera bort användare utan username och se till att varje användare har ett unikt ID
                const filteredUsers = Object.keys(usersData)
                    .map(key => ({ id: key, ...usersData[key] }))
                    .filter(user => user.username);
                
                setUsers(filteredUsers);
            } else {
                console.log("No users found");
            }
        };

        fetchUsers();
    }, []);

    const toggleSelection = (username) => {
        setSelectedUsers(prevState => ({
            ...prevState,
            [username]: !prevState[username],
        }));
    };

    const handleInvite = async () => {
        const invitedUsers = Object.keys(selectedUsers).filter(username => selectedUsers[username]);
        //console.log("Invited users:", invitedUsers);
        // Här kan du lägga till logik för att spara inbjudna användare i databasen
        const huntData = {
            name: huntName,
            time: huntTime,
            image: huntImage,
            invitedUsers: invitedUsers
        };

        try {
            await storeHunt(huntData);
            console.log("Hunt created successfully!");
            console.log(huntData)
            // Navigera användaren till en annan sida om du vill, t.ex. hem
            //navigation.navigate('Home');
        } catch (error) {
            console.error("Failed to create hunt:", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 35, marginBottom: 20 }}>Invite Players</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <CheckBox
                            checked={!!selectedUsers[item.id]}
                            onPress={() => toggleSelection(item.id)}
                        />
                        <Text style={{ fontSize: 22 }}>{item.username}</Text>
                    </View>
                )}
            />
            <TouchableOpacity onPress={handleInvite} style={{ marginTop: 20 }}>
                <View style={{ backgroundColor: 'blue', padding: 15, borderRadius: 5 }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Invite Selected Users</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};


export default InvitePlayers;
