import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ParticipantLookupResponse } from './types/participants';
import api from '@/lib/api';

export default function PatientSearch() {
  const [textColor, setTextColor] = useState('grey');
  const [searchText, setSearchText] = useState('');
  const [filteredPatients, setParticipants] = useState<ParticipantLookupResponse[]>([]);
  const [submitData, setSubmitData] = useState<ParticipantLookupResponse | null>(null); // Store the full patient data
  const [showDropdown, setShowDropdown] = useState(false);

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
    const sessionKey = await getSessionKey();
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
      lookupParticipants();
      setShowDropdown(true);
    } else {
      setParticipants([]);
      setShowDropdown(false);
    }
  };

  const fetchBloodPressureHistory = async (participantId: number) => {
    const url = `https://cs-25-303.wyatt-herkamp.dev/api/participant/stats/bp/history/${participantId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const fetchHealthOverview = async (participantId: number) => {
    const url = `https://cs-25-303.wyatt-herkamp.dev/api/participant/get/${participantId}/health_overview`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const handlePatientSelect = async (patient: ParticipantLookupResponse) => {
    setSearchText(`${patient.first_name} ${patient.last_name}`);
    const bloodPressureHistory = await fetchBloodPressureHistory(patient.id);
    const healthOverviewHistory = await fetchHealthOverview(patient.id);
    const patientHistory = { ...patient, bloodPressureHistory, healthOverviewHistory };
    setSubmitData(patientHistory); // Store the full patient data
    setShowDropdown(false);
    console.log(`Patient Selected: ${patient.first_name} ${patient.last_name} ID: ${patient.id}`);
  };

  const handleSubmit = () => {
    if (submitData) {
      console.log('Submitted Data:', JSON.stringify(submitData, null, 2));
    } else {
      console.log('No patient selected!');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Patient Search</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Search for patient"
          value={searchText}
          onChangeText={handleSearchChange}
        />

        {/* Conditionally render the patient list or a message when no results found */}
        {showDropdown && (
          <ParticipantsList
            participants={filteredPatients}
            searchText={searchText}
            handlePatientSelect={handlePatientSelect}
          />
        )}

        <TouchableOpacity style={styles.submitContainer} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
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
  handlePatientSelect,
}: {
  participants: ParticipantLookupResponse[];
  searchText: string;
  handlePatientSelect: (patient: ParticipantLookupResponse) => void; // Update to expect full patient object
}) {
  if (participants.length === 0 && searchText.length === 0) {
    return <Text>No patients found</Text>;
  }

  return (
    <FlatList
      data={participants}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ParticipantItem participant={item} handlePatientSelect={handlePatientSelect} />
      )}
      style={styles.dropdown}
    />
  );
}

function ParticipantItem({
  participant,
  handlePatientSelect,
}: {
  participant: ParticipantLookupResponse;
  handlePatientSelect: (patient: ParticipantLookupResponse) => void;
}) {
  // Handle patient selection
  const handlePatientSelectLocal = () => {
    handlePatientSelect(participant); // Pass full patient data to handlePatientSelect
  };

  return (
    <TouchableOpacity style={styles.patientItem} onPress={handlePatientSelectLocal}>
      <Text style={styles.patientName}>{participant.first_name + ' ' + participant.last_name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#B9CE88',
    padding: 20,
  },
  title: {
    position: 'relative',
    top: 275,
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
    top: 275,
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
    maxHeight: 270,
    width: '68%',
    position: 'absolute',
    top: 450,
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1,
  },
  goBack: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
    fontSize: 27,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
  },
  submitText: {
    fontSize: 27,
  },
});
