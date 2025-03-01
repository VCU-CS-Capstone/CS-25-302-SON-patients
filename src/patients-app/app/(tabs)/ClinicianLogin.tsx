import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useState } from "react";

export default function TabOneScreen() {
  const [password, setPassword] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinician Login</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => alert("Button is Pressed")}
      >
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
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
    color: "grey",
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
});
