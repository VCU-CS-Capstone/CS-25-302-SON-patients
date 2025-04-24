import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


export default function PatientGoalsScreen() {

  const handleBackPress = () => {
    router.back();
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.navButton}>
          <Text style={styles.navButtonText}>Go To Health Stats</Text>
        </TouchableOpacity>
        <Text style={styles.lastVisit}>Last Visit: 04/14/25</Text>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.mainHeader}>Health Goals:</Text>
        <View style={styles.goalList}>
          <Text style={styles.goalItem}>1. Lorem ipsum dolor sit amet.</Text>
          <Text style={styles.goalItem}>2. Consectetur adipiscing elit.</Text>
          <Text style={styles.goalItem}>3. Sed do eiusmod tempor incididunt.</Text>
        </View>
      </ScrollView>

      {/* Audio Button */}
      <TouchableOpacity style={styles.audioButton}>
        <Ionicons name="volume-high" size={70} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#B9CE88',
    width: '100%',
    height: 150,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    width: 280,
    height: 60,
  },
  navButtonText: {
    fontSize: 28,
    color: 'black',
    fontWeight: '600',
  },
  lastVisit: {
    fontSize: 50,
    color: 'black',
  },
  body: {
    padding: 30,
  },
  mainHeader: {
    fontSize: 70,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  goalList: {
    paddingLeft: 10,
  },
  goalItem: {
    fontSize: 40,
    marginBottom: 15,
  },
  audioButton: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    backgroundColor: '#B9CE88',
    width: 150,
    height: 150,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
