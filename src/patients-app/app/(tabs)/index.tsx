import { StyleSheet, TextInput } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { React } from "react";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinician Login</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
      />

      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "67%",
    height: "50px",
    backgroundColor: "white",
    marginTop: "30px",
    padding: 10,
    fontSize: 30,
    color: "grey",
  },
});
