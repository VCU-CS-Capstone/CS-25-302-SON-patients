import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Slot, useRouter } from 'expo-router';

import BloodSugarScreen from './blood-sugar';
import BloodPressureScreen from './blood-pressure';
import WeightScreen from './weight';

// Define types for our route params
type RootStackParamList = {
  BloodSugar: { data: BloodSugarData };
  BloodPressure: { data: BloodPressureData };
  Weight: { data: WeightData };
};

// Define data types
interface BloodSugarData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface BloodPressureData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface WeightData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

// Define props interfaces
interface SidebarProps {
  bloodSugarData: BloodSugarData;
  bloodPressureData: BloodPressureData;
  weightData: WeightData;
}

interface MainLayoutProps {
  data: [BloodSugarData, BloodPressureData, WeightData];
}

interface RouteProps {
  route: {
    params?: {
      data: any;
    };
  };
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const screenMultiplier = ((screenHeight / 1024) + (screenWidth/1366))/2;

const Sidebar: React.FC<SidebarProps> = ({bloodSugarData, bloodPressureData, weightData}) => {
  const router = useRouter();
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={() => router.push({
      pathname: '/blood-sugar',
      params: { data: JSON.stringify(bloodSugarData) }
      })}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Blood Sugar</Text>
          <Image
            style={styles.icon}
            source={require('../assets/images/bloodSugarSymbol.png')}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({
      pathname: '/blood-pressure',
      params: { data: bloodPressureData }
      })}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Blood Pressure</Text>
          <Image
            style={styles.icon}
            source={require('../assets/images/bloodPressureSymbol.png')}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({
      pathname: '/weight',
      params: { data: weightData }
      })}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Weight</Text>
          <Image
            style={styles.icon}
            source={require('../assets/images/weightSymbol.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ data }) => {
  const bloodSugarData = data.bloodGlucose;
  const bloodPressureData = data.bloodPressure;
  const weightData = data.weight;
  return (
    <View style={styles.container}>
      <Sidebar bloodSugarData={bloodSugarData} bloodPressureData={bloodPressureData} weightData={weightData}/>
      <View style={styles.content}>
        <Slot/>
      </View>
    </View>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  icon: {
    height: 80 * screenMultiplier,
    width: 150 * screenMultiplier,
    resizeMode: 'contain',
  },
  buttonContainer: {
    backgroundColor: 'white',
    padding: 20 * screenMultiplier,
    borderRadius: 30 * screenMultiplier,
    justifyContent: 'center',
    alignItems: 'center',
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
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#B9CE88',
    paddingHorizontal: 25 * screenMultiplier,
    flex: 0.4,
    justifyContent: 'space-around',
    paddingBottom: 20 * screenMultiplier,
    alignItems: 'flexStart',
  },
  buttonText: {
    color: 'black',
    fontSize: 40,
    marginVertical: 10 * screenMultiplier,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10 * screenMultiplier,
  },
  screen: {
    flex: 1,
    alignItems: 'left',
  },
});