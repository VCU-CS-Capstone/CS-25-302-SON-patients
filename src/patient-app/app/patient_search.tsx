import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from "react-native";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function PatientSearch() {
  const [textColor, setTextColor] = useState("grey");
  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);


  // Retrieve session key securely
  const getSessionKey = async () => {
    try {
      const sessionKey = await SecureStore.getItemAsync("sessionKey");
      if (sessionKey) {
        return sessionKey;
      } else {
        console.log("No session key found");
        return null;
      }
    } catch (error) {
      console.log("Error retrieving session key", error);
      return null;
    }
  };


  // Simulate an API call to fetch participants based on the search text
  const lookupParticipants = async () => {
    const sessionKey = await getSessionKey(); // Retrieve the session key from Secure Store
    if (!sessionKey) {
      console.log("Session key is missing!");
      return;
    }

    // Example API call with the session key for authorization
    const response = await fetch("https://cs-25-303.wyatt-herkamp.dev/api/participant/lookup", {
      method: "POST",
      headers: {
        Authorization: `Session ${sessionKey}`, // Using the session key for authorization
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: searchText.split(" ")[0],
        last_name: searchText.split(" ")[1],
      }),
    });

    const data = await response.json();
    setFilteredPatients(data); // Set the filtered patients data
  };

  // Handle search text change
  const handleSearchChange = (text) => {
    setSearchText(text);
    setTextColor(text.length >= 1 ? "black" : "grey");
    if (text.length >= 1) {
      lookupParticipants(); // Lookup participants when search text changes
    } else {
      setFilteredPatients([]); // Clear filtered patients if search text is empty
    }
  };

  // Handle when a patient is selected
  const handlePatientSelect = (patientName) => {
    alert(`Selected patient: ${patientName}`);
    setSearchText(""); // Optionally clear the search input after selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Search</Text>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Search for a patient"
        value={searchText}
        onChangeText={handleSearchChange}
      />

      {/* Conditionally render the patient list below the input */}
      {searchText.length > 0 && (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.patientItem}
              onPress={() => handlePatientSelect(item.name)} // Trigger handlePatientSelect when a patient is selected
            >
              <Text style={styles.patientName}>
                {item.name + " - " + item.date}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}

      {/* Link to go back */}
      <Link href="/clinician_login" style={styles.goBack}>
        <Text>Go Back</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B9CE88",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    width: "67%",
    height: 50,
    backgroundColor: "white",
    marginTop: 30,
    paddingLeft: 10,
    fontSize: 30,
    borderRadius: 5,
    outlineWidth: 0,
    position: "relative",
  },
  patientItem: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderRadius: 5,
  },
  patientName: {
    fontSize: 20,
    color: "black",
  },
  dropdown: {
    maxHeight: 200, // Set a maximum height to make it scrollable
    width: "65%",
    position: "absolute",
    top: 512, // Adjust this if needed to fit the UI
    backgroundColor: "white",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 1, // Make sure the dropdown appears above other elements
  },
  goBack: {
    position: "absolute",
    bottom: 30,
    left: 50,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 10,
  },
});
