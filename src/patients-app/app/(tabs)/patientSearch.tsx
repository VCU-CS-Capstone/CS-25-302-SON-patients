import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

export default function PatientSearch() {
  // Example test with fake data patients
  const patients = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Alice Johnson" },
    { id: "4", name: "Bob Brown" },
    { id: "5", name: "Charlie Davis" },
  ];

  const [textColor, setTextColor] = useState("grey");
  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patients); // List of filtered patients

  const handleSearchChange = (text) => {
    setSearchText(text);
    const filterName = patients.filter((patient) => {
      return patient.name.toLowerCase().includes(text.toLowerCase());
    });
    setFilteredPatients(filterName);
    setTextColor(text.length >= 1 ? "black" : "grey");
  };

  const handlePatientSelect = (patientName) => {
    alert(`Selected patient: ${patientName}`);
    // Here you can navigate to a patient detail page or take other actions
    setSearchText(""); // Optionally clear the search input after selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Search</Text>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Search for a patient"
        value={searchText}
        onChangeText={handleSearchChange} // Trigger handleSearchChange when text changes
      />

      {/* Conditionally render the patient list below the input */}
      {searchText.length > 0 && (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.patientItem}
              onPress={() => handlePatientSelect(item.name)} // Trigger handlePatientSelect when a patient is selected
            >
              <Text style={styles.patientName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}

      {/* Link to go back */}
      <Link href="/ClinicianLogin" style={styles.goBack}>
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
    fontSize: 20,
    borderRadius: 5,
    outlineWidth: 0,
  },
  patientItem: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderRadius: 5,
  },
  patientName: {
    fontSize: 18,
    color: "black",
  },
  dropdown: {
    maxHeight: 200, // Set a maximum height to make it scrollable
    width: "64%",
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
