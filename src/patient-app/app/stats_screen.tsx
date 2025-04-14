import React from 'react';
import { Text, View, Dimensions, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

import MainLayout from './main_layout';

const screenWidth: number = Dimensions.get("window").width;
const screenHeight: number = Dimensions.get("window").height;
const screenMultiplier: number = ((screenHeight / 1024) + (screenWidth/1366))/2;

interface LastVisitTitleProps {
  date: string;
}

export default function StatsScreen(): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse patient data from params if available
  const patientData = params.patientData
    ? JSON.parse(params.patientData as string)
    : null;
  
  const testArr = [1,2,3]
  console.log("array test: ", testArr.slice(0, 10))

  const calculateLength = (length) => {if (length <= 10) {return length} else {return 10}}
  const bloodGlucose = patientData.bloodGlucoseHistory.data || null
  const bloodGlucoseLength = calculateLength(patientData.bloodGlucoseHistory.total)
  const bloodGlucoseDates = bloodGlucose.map((value, index) => bloodGlucose[bloodGlucoseLength-index-1].date_of_visit)
  const bloodGlucoseValues = bloodGlucose.map((value, index) => bloodGlucose[bloodGlucoseLength-index-1].result)
  const bloodGlucoseNew = {labels: bloodGlucoseDates.slice(-5), datasets: [{data: bloodGlucoseValues.slice(-5)}]}

  const bloodPressure = patientData.bloodPressureHistory.data || null
  const bloodPressureLength = calculateLength(patientData.bloodPressureHistory.total)
  const bloodPressureDates = bloodPressure.map((value, index) => bloodPressure[bloodPressureLength-index-1].date_of_visit)
  const bloodPressureValues = bloodPressure.map((value, index) => bloodPressure[bloodPressureLength-index-1].readings)
  const bloodPressureNew = {labels: bloodPressureDates.slice(-5), datasets: [{data: bloodPressureValues.slice(-5)}]}

  const weight = patientData.weightHistory.data || null
  const weightLength = calculateLength(patientData.weightHistory.total)
  const weightDates = weight.map((value, index) => weight[weightLength-index-1].date_of_visit)
  const weightValues = weight.map((value, index) => weight[weightLength-index-1].weight)
  const weightNew = {labels: weightDates.slice(-5), datasets: [{data: weightValues.slice(-5)}]}

  const dataNew = {bloodGlucose: bloodGlucoseNew, bloodPressure: bloodPressureNew, weight: weightNew}

  // Get the last visit date or use a default
  const lastVisitDate = patientData?.last_visited || bloodGlucose[0].date_of_visit || bloodPressure[0].date_of_visit || weight[0].date_of_visit || "N/A";

  const handleBackPress = () => {
    router.back();
  };
  
  const handleHealthGoalsPress = () => {
    router.push({
      pathname: '/health_goals',
      params: { patientData: params.patientData }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: .15, backgroundColor: '#B9CE88', padding: 20 * screenMultiplier, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 60 }}> 
        <TouchableOpacity onPress={handleBackPress}>
          <BackArrow />
        </TouchableOpacity>
        <View style={styles.lastVisitContainer}>
          <LastVisitTitle date={lastVisitDate} />
        </View>
        <TouchableOpacity onPress={handleHealthGoalsPress}>
          <HealthGoalsButton />
        </TouchableOpacity>
      </View> 

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <MainLayout data={dataNew} />
        </View>
      </View>
    </View>
  );
}

const BackArrow = (): JSX.Element => {
  return (
    <View style={{flex:1, justifyContent: 'center', flexDirection: 'columns'}}>
      <Icon
        name="arrow-back"
        type="material"
        size={100 * screenMultiplier}
        color="black"
      />
    </View>
  );
};

const LastVisitTitle = ({ date }: LastVisitTitleProps): JSX.Element => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.lastVisitText}>
        Last Visit: {date}
      </Text>
    </View>
  );
};

const HealthGoalsButton = (): JSX.Element => {
  return (
    <View style={styles.healthGoalsContainer}>
      <Text style={styles.healthGoalsText}>
        Go To Health Goals
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  lastVisitContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  lastVisitText: {
    fontSize: 68,
  },
  healthGoalsContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30 * screenMultiplier,
    padding: 10 * screenMultiplier,
    margin: 10 * screenMultiplier,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  healthGoalsText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
});