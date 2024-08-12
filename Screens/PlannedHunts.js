import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import { getUser } from "../util/http";

const PlannedHunts = ({ navigation }) => {

    return (
      <View style={styles.container}>
        <Text style={styles.title}>PlannedHunts är här!</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: "center",
    },
  });

export default PlannedHunts;