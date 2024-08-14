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
