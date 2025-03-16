import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ParticipantLookupResponse } from './types/participants';
import api from '@/lib/api';

export default function PatientSearch() {
  const [textColor, setTextColor] = useState('grey');
  const [searchText, setSearchText] = useState('');
  const [filteredPatients, setParticipants] = useState<ParticipantLookupResponse[]>([]);
  const [submitData, setSubmitData] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // Control visibility of dropdown

  // Retrieve session key securely
  const getSessionKey = async () => {
    try {
      const sessionKey = await SecureStore.getItemAsync('sessionKey');
      if (sessionKey) {
        return sessionKey;
      } else {
        console.log('No session key found');
        return null;
      }
    } catch (error) {
      console.log('Error retrieving session key', error);
      return null;
    }
  };

  // Simulate an API call to fetch participants based on the search text
  const lookupParticipants = async () => {
    const sessionKey = await getSessionKey(); // Retrieve the session key from Secure Store
    if (!sessionKey) {
      console.log('Session key is missing!');
      return;
    }

    // Example API call with the session key for authorization
    const response = await api.participants.lookup({
      first_name: searchText.split(' ')[0],
      last_name: searchText.split(' ')[1],
    });
    setParticipants(response.data); // Set the filtered patients data
  };

  // Handle search text change
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setTextColor(text.length >= 1 ? 'black' : 'grey');
    if (text.length >= 1) {
      lookupParticipants(); // Lookup participants when search text changes
      setShowDropdown(true);
    } else {
      setParticipants([]); 
      setShowDropdown(false);
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patientName: string) => {
    alert(`Selected patient: ${patientName}`);
    setShowDropdown(false); // Hide dropdown when patient is selected
  };

  const handleSubmit = () => {
    console.log(`submitted Data: ${submitData}`);
    setSubmitData('');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Patient Search</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Search for a patient"
          value={searchText}
          onChangeText={handleSearchChange}
        />

        {/* Conditionally render the patient list or a message when no results found */}
        {showDropdown && (
          <ParticipantsList 
            participants={filteredPatients} 
            searchText={searchText} 
            setShowDropdown={setShowDropdown} // Pass setShowDropdown to ParticipantsList
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text>Submit</Text>
        </TouchableOpacity>

        {/* Link to go back */}
        <Link href="/clinician_login" style={styles.goBack}>
          <Text>Go Back</Text>
        </Link>
      </View>
    </TouchableWithoutFeedback>
  );
}

function ParticipantsList({
  participants,
  searchText,
  setShowDropdown, // Receive setShowDropdown from the parent
}: {
  participants: ParticipantLookupResponse[];
  searchText: string;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>; // SetState type for setShowDropdown
}) {
  if (participants.length === 0 && searchText.length === 0) {
    return <Text>No patients found</Text>;
  }

  return (
    <FlatList
      data={participants}
      keyExtractor={(item) => item.id.toString()} // Handle 'id' or 'name' based on availability
      renderItem={({ item }) => <ParticipantItem participant={item} setShowDropdown={setShowDropdown} />} // Pass setShowDropdown to ParticipantItem
      style={styles.dropdown}
    />
  );
}

function ParticipantItem({ participant, setShowDropdown }: { participant: ParticipantLookupResponse; setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>; }) {
  // Handle when a patient is selected
  const handlePatientSelect = () => {
    console.log(`Selected patient: ID = ${participant.id}, Name = ${participant.first_name} ${participant.last_name}`); // Log the ID, first name, and last name
    setShowDropdown(false);
  };

  return (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => handlePatientSelect()} // Trigger handlePatientSelect when a patient is selected
    >
      <Text style={styles.patientName}>{participant.first_name + ' ' + participant.last_name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B9CE88',
    padding: 20,
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
    paddingLeft: 10,
    fontSize: 30,
    borderRadius: 5,
    outlineWidth: 0,
    position: 'relative',
  },
  patientItem: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
  },
  patientName: {
    fontSize: 20,
    color: 'black',
  },
  dropdown: {
    maxHeight: 200, // Set a maximum height to make it scrollable
    width: '65%',
    position: 'absolute',
    top: 512, // Adjust this if needed to fit the UI
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1, // Make sure the dropdown appears above other elements
  },
  goBack: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
  },
  submitButton: {
    position: 'absolute',
    backgroundColor: "white",
    bottom: 30,
    right: 50,
    padding: 6,
    borderRadius: 10
  }
});
