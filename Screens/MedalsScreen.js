import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUser, getCompletedHuntsForUser, fetchActiveHunts } from "../util/http";

const MedalsScreen = () => {
    const [hunts, setHunts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userMap, setUserMap] = useState({});
    const [userName, setUserName] = useState({});
    const [completedHunts, setCompletedHunts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('inne i medals')

    useEffect(() => {
        const fetchCompletedHunts = async () => {
            try {
                const username = await AsyncStorage.getItem("username");
                console.log('username: ', username)

                const fetchedUser = await getUser(username);
                setUserId(fetchedUser.id);
                setUserName(username);
                console.log('userId: ', userId)
                
                const activeHunts = await fetchActiveHunts(fetchedUser.id)
                console.log('activeHunts: ', activeHunts)
                const completed = activeHunts.filter(hunt => 
                    hunt.invitedUsers.some(user => user.id === fetchedUser.id && user.completed)
                )
                console.log('completed: ', completed)

                setCompletedHunts(completed)
            } catch (err) {
                setError("Kunde inte hämta slutförda jakter.");
                console.error('Fetch Error: ', err);
            } finally {
                setLoading(false);
                console.log('Loading complete.');
            }
        };

        fetchCompletedHunts();
    }, []);

    // if (loading) {
    //     return <Text>Laddar...</Text>;
    // }

    // if (error) {
    //     return <Text>{error}</Text>;
    // }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Slutförda Jakter</Text>
            <FlatList
                data={completedHunts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.huntContainer}>
                        <Image source={{ uri: item.huntImageUrl }} style={styles.huntImage} />
                        <Text style={styles.huntName}>{item.name}</Text>
                        {/* Visa medalj eller annan indikation här */}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    huntContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    huntImage: {
        width: '100%',
        height: 200,
        marginBottom: 8,
    },
    huntName: {
        fontSize: 18,
    },
});

export default MedalsScreen;
