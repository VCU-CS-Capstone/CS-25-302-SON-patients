import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

export default function PatientSearch() {
  const [textColor, setTextColor] = useState("grey");

  const handleTextChange = (text) => {
    setTextColor(text.length >= 1 ? "black" : "grey");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Search</Text>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Name"
        onChangeText={handleTextChange}
      />
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
    color: "grey", // This is the default color
    outlineWidth: 0,
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
  goBack: {
    position: "absolute",
    bottom: 30,
    left: 50,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 10,
  },
});
