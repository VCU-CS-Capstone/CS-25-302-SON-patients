import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { printToFileAsync } from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function Index() {
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const router = useRouter();

  // Sample patient data (in a real app, this would come from database)
  const patientData = {
    name: "John Doe",
    birthDate: "1985-03-15", // YYYY-MM-DD format
    bloodPressure: "120/80",
    weight: "180 lbs",
    bloodSugar: "95 mg/dL",
    healthGoals: "Reduce cholesterol, increase daily exercise"
  };

  const handleViewLastVisit = () => {
    router.replace('/view_last_visit');
  };

  const handlePrintPDF = async () => {
    try {
      // Create HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1 { color: #333; }
              .section { margin-bottom: 15px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Patient Medical Record</h1>
            <div class="section">
              <p><span class="label">Patient Name:</span> ${patientData.name}</p>
              <p><span class="label">Date of Print:</span> ${new Date().toLocaleDateString()}</p>
              <p><span class="label">Birth Date:</span> ${new Date(patientData.birthDate).toLocaleDateString()}</p>
            </div>
            <div class="section">
              <p><span class="label">Blood Pressure:</span> ${patientData.bloodPressure}</p>
              <p><span class="label">Weight:</span> ${patientData.weight}</p>
              <p><span class="label">Blood Sugar:</span> ${patientData.bloodSugar}</p>
            </div>
            <div class="section">
              <p><span class="label">Health Goals:</span> ${patientData.healthGoals}</p>
            </div>
          </body>
        </html>
      `;

      // Generate PDF file
      const { uri } = await printToFileAsync({
        html: htmlContent,
        base64: false
      });

      // Share the PDF
      if (uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Patient Medical Record'
          });
        } else {
          Alert.alert('Sharing Unavailable', 'Unable to share PDF on this device');
        }
      }
    } catch (error) {
      console.error('PDF Generation Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Print Error', `Unable to generate PDF: ${errorMessage}`);
    }
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
      <Text style={styles.patientName}>{patientData.name}</Text>
      
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