import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function Index() {
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const router = useRouter();

  // Sample patient data (in a real app, this would come from your database)
  const patientName = "John Doe";

  const handleViewLastVisit = () => {
    router.replace('/view_last_visit');
  };

  const handlePrintPDF = () => {
    // Implement PDF printing logic
    // This might involve using a library like react-native-print
    console.log('Print PDF functionality to be implemented');
  };

  const handleSettings = () => {
    router.replace('/settings');
  };

  const handleExit = () => {
    setIsExitModalVisible(true);
  };

  const handleExitConfirm = () => {
    router.replace('/return_tablet');
    setIsExitModalVisible(false);
  };

  const handleExitCancel = () => {
    setIsExitModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.patientName}>{patientName}</Text>
      
      <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
        <Text style={styles.exitButtonText}>X</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleViewLastVisit} style={styles.button}>
          <Text style={styles.buttonText}>View Last Visit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrintPDF} style={styles.button}>
          <Text style={styles.buttonText}>Print PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSettings} style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isExitModalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure you want to exit?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleExitConfirm} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExitCancel} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exitButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'lightgray',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#e0e5d8',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
  },
});