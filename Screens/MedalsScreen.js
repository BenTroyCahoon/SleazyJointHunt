import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUser, getCompletedHuntsForUser, fetchActiveHunts } from "../util/http";

const MedalsScreen = () => {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState({});
    const [completedHunts, setCompletedHunts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //console.log('inne i medals')

    useEffect(() => {
        const fetchCompletedHunts = async () => {
            try {
                const username = await AsyncStorage.getItem("username");
                //console.log('username: ', username)

                const fetchedUser = await getUser(username);
                setUserId(fetchedUser.id);
                setUserName(username);
                //console.log('userId: ', userId)
                
                const activeHunts = await fetchActiveHunts(fetchedUser.id)
                console.log('activeHunts: ', activeHunts)
                const completed = activeHunts.filter(hunt => 
                    hunt.invitedUsers.some(user => user.id === fetchedUser.id && user.completed)
                )
                //console.log('completed: ', completed)

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

    
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.huntImageUrl }} style={styles.image} />
                <Text style={styles.huntName}>{item.name}</Text>
            </View>
        </View>
    );

    if (loading) {
        return <Text>Laddar...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Slutförda Jakter</Text>
            <FlatList
                data={completedHunts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={4} // Sätt antal kolumner per rad
                columnWrapperStyle={styles.row} // Stil för radens wrapper
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#9bc39e",
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
        color: "#275829",
        fontWeight: "bold",
        textAlign: "center",
    },
    card: {
        flex: 1,
        margin: 5,
        alignItems: "center",
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 45,
    },
    huntName: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    row: {
        justifyContent: 'space-around', // Jämnt fördela utrymme mellan kolumner
    }
});

export default MedalsScreen;
