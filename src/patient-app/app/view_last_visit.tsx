import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ViewLastVisitScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Last Visit Details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e5d8',
  },
  text: {
    fontSize: 20,
  },
});
