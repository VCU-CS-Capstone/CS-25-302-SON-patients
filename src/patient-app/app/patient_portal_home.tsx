import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { printToFileAsync } from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function PatientPortalHome() {
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse patient data from params
  const patientData = params.patientData 
  ? JSON.parse(params.patientData as string) 
  : {
      first_name: 'John',
      last_name: 'Doe',
      // Default values for when no patient is selected
      birthDate: '1985-03-15',
      bloodPressure: '120/80',
      weight: '180 lbs',
      bloodSugar: '95 mg/dL',
      healthGoals: 'Reduce cholesterol, increase daily exercise',
    };

  const patientName = `${patientData.first_name} ${patientData.last_name}`;


  const handleViewLastVisit = () => {
    router.push({
      pathname: '/stats-screen-tabs',
      params: { patientData: JSON.stringify(patientData) }
    });
  };

  const handlePrintPDF = async () => {
    try {
      // Use the most recent blood pressure reading
      const bpReading = patientData.bloodPressureHistory?.data?.[0]?.readings?.sit || { systolic: '--', diastolic: '--' };
      const bloodPressureStr = `${bpReading.systolic}/${bpReading.diastolic}`;
      
      // Use the most recent weight
      const weight = patientData.weightHistory?.data?.[0]?.weight || '--';
      
      // Use the most recent blood glucose reading
      const bloodSugar = patientData.bloodGlucoseHistory?.data?.[0]?.result || '--';
      
      // Get goals
      const goals = patientData.goalsHistory?.map(g => g.goal).join(', ') || 'No goals set';
  
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
              <p><span class="label">Patient Name:</span> ${patientData.first_name} ${patientData.last_name}</p>
              <p><span class="label">Date of Print:</span> ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="section">
              <p><span class="label">Blood Pressure:</span> ${bloodPressureStr}</p>
              <p><span class="label">Weight:</span> ${weight} lbs</p>
              <p><span class="label">Blood Sugar:</span> ${bloodSugar} mg/dL</p>
            </div>
            <div class="section">
              <p><span class="label">Health Goals:</span> ${goals}</p>
            </div>
          </body>
        </html>
      `;

      // Generate PDF file
      const { uri } = await printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Share the PDF
      if (uri) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Patient Medical Record',
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

      <Modal transparent={true} visible={isExitModalVisible} animationType="slide">
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
    backgroundColor: '#B9CE88',
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
    backgroundColor: '#B9CE88',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
  },
});
