import { useState } from 'react';
import { Link } from 'expo-router';
import React from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function ClinicianLogin() {
  const [password, setPassword] = useState('');
  const [passwordColor, setPasswordColor] = useState('grey');

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordColor(text.length >= 1 ? 'black' : 'grey');
  };

  // Store session key securely
  const storeSessionKey = async (sessionKey: string) => {
    try {
      await SecureStore.setItemAsync('sessionKey', sessionKey);
      console.log('Session key stored successfully!');
    } catch (error) {
      console.log('Error storing session key', error);
    }
  };

  const loginUser = async () => {
    if (password.length < 1) {
      console.log('Password is required!');
      return;
    }

    try {
      const headers: Record<string, string> = {
        // If we are sending JSON we need to tell the server so we are saying the content type of our body is JSON
        'Content-Type': 'application/json',
      };
      const response = await fetch('https://cs-25-303.wyatt-herkamp.dev/api/auth/login/password', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          username: 'admin', // Hardcoded username
          password: password, // Password from user input
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.session.session_key) {
        await storeSessionKey(data.session.session_key); // Store the session key if login is successful
        console.log('Login Successful!');
      } else {
        console.log('Login Failed: Incorrect credentials or other error');
      }
    } catch (error) {
      console.log('Login Error: ', error);
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
      <TouchableOpacity style={styles.buttonContainer} onPress={loginUser}>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B9CE88',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    width: '67%',
    height: 50,
    backgroundColor: 'white',
    marginTop: 30,
    padding: 10,
    fontSize: 30,
    //outlineWidth: 0,
  },
  buttonContainer: {
    margin: 40,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 2,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 40,
    color: 'black',
  },
  nextPage: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
  },
});
