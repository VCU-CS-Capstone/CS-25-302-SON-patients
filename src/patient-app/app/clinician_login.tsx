import { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function ClinicianLogin() {
  const [password, setPassword] = useState('');
  const [passwordColor, setPasswordColor] = useState('grey');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Hook for navigation

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordColor(text.length >= 1 ? 'black' : 'grey');
    setErrorMessage(''); // Clear error message when typing
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
      setErrorMessage('Password is required!');
      return;
    }

    try {
      const response = await fetch('https://cs-25-303.wyatt-herkamp.dev/api/auth/login/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.session?.session_key) {
        await storeSessionKey(data.session.session_key);
        console.log('Login Successful!');
        router.replace('/patient_search'); // Navigate to next screen
      } else {
        setErrorMessage('Incorrect credentials');
      }
    } catch (error) {
      setErrorMessage('Login Error: Network issue or server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinician Login</Text>
      <TextInput
        style={[styles.input, { color: passwordColor }]}
        secureTextEntry
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
      />

      {/* Show error message if login fails */}
      {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      <TouchableOpacity style={styles.buttonContainer} onPress={loginUser}>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
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
    outlineWidth: 0
  },
  errorMessage: {
    color: 'red',
    fontSize: 18,
    marginTop: 10,
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
});
