
import { useState } from "react";
import { Link } from "expo-router";
import React from "react";
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function ClinicianLogin() {

  const [password, setPassword] = useState("");
  const [passwordColor, setPasswordColor] = useState("grey");
  

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordColor(text.length >= 1 ? "black" : "grey");
  };

  // Store session key securely
    const storeSessionKey = async (sessionKey) => {
      try {
        await SecureStore.setItemAsync("sessionKey", sessionKey);
        console.log("Session key stored successfully!");
      } catch (error) {
        console.log("Error storing session key", error);
      }
    };


  const loginUser = async () => {
    try {
      const response = await fetch("https://cs-25-303.wyatt-herkamp.dev/api/participant/lookup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({password}),
      });
      
      const data = await response.json();

      if (data.sessionKey) {
        await storeSessionKey(data.sessionKey);
        console.log("Login Successful!");
      } else {
        console.log("Login Failed");
      }
    } catch (error) {
      console.log("Login Error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinician Login</Text>
      <TextInput
        style={[styles.input, { color: passwordColor }]}
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={loginUser}
      >
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
      {/* temporary navigation button for next page*/}
      {/* <TouchableOpacity style={styles.nextPage}>
        <Text style={styles.nextPageText}>Next Page</Text>
      </TouchableOpacity> */}
      <Link href="/patient_search" style={styles.nextPage}>
      <Text>Next Page</Text>
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
    padding: 10,
    fontSize: 30,
  },
  buttonContainer: {
    margin: 40,
    width: 300,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 40,
    color: "black",
  },
  nextPage: {
    position: "absolute",
    bottom: 50,
    right: 50,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 10,
  },
});
