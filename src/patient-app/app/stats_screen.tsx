import React from 'react';
import { Text, View, Dimensions, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';

import MainLayout from './main_layout';

const screenWidth: number = Dimensions.get("window").width;
const screenHeight: number = Dimensions.get("window").height;
const screenMultiplier: number = ((screenHeight / 1024) + (screenWidth/1366))/2;

interface StatsScreenProps {
  data?: Array<any>;
}

interface LastVisitTitleProps {
  date: string;
}

export default function StatsScreen({ data }: StatsScreenProps): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse patient data from params if available
  const patientData = params.patientData 
    ? JSON.parse(params.patientData as string)
    : null;
  
  // Get the last visit date or use a default
  const lastVisitDate = patientData?.lastVisitDate || "January 1, 2025";
  
  const handleBackPress = () => {
    router.back();
  };
  
  const handleHealthGoalsPress = () => {
    router.push({
      pathname: '/health_goals',
      params: { patientData: params.patientData }
    });
  };

  // Create sample data for the tabs if no data is provided
  const bloodSugarData = patientData?.bloodGlucoseHistory || { data: [] };
  const bloodPressureData = patientData?.bloodPressureHistory || { data: [] };
  const weightData = patientData?.weightHistory || { data: [] };
  
  const tabsData = [bloodSugarData, bloodPressureData, weightData];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#B9CE88', padding: 20 * screenMultiplier }}>
        <TouchableOpacity onPress={handleBackPress} style={{ marginBottom: 10 * screenMultiplier }}>
          <BackArrow />
        </TouchableOpacity>
        <StatsHeader />
      </View>
      
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.lastVisitContainer}>
          <LastVisitTitle date={lastVisitDate} />
        </View>
        
        <View style={{ flex: 2 }}>
          <MainLayout data={tabsData} />
        </View>
        
        <TouchableOpacity onPress={handleHealthGoalsPress} style={{ alignItems: 'center', marginVertical: 20 * screenMultiplier }}>
          <HealthGoalsButton />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const StatsHeader = (): JSX.Element => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 36 * screenMultiplier, fontWeight: 'bold' }}>
        Patient Statistics
      </Text>
    </View>
  );
};

const BackArrow = (): JSX.Element => {
  return (
    <Icon
      name="arrow-back"
      type="material"
      size={50 * screenMultiplier}
      color="black"
    />
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
    flex: 0.5,
    justifyContent: 'center',
  },
  lastVisitText: {
    fontSize: 68,
  },
  healthGoalsContainer: {
    flex: 0.3,
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