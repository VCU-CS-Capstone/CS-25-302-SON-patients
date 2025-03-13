import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReturnTabletScreen() {
  const router = useRouter();

  const handleOkay = () => {
    // In a real app, this would navigate to the clinician login
    router.replace('/clinician_login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Please return this tablet to a staff member.</Text>

      <TouchableOpacity onPress={handleOkay} style={styles.button}>
        <Text style={styles.buttonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e5d8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
});
