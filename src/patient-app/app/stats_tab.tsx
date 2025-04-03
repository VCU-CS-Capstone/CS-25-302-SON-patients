import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import BloodSugarScreen from './blood_sugar_screen';
import BloodPressureScreen from './blood_pressure_screen';
import WeightScreen from './weight-screen';

const screenWidth: number = Dimensions.get("window").width;
const screenHeight: number = Dimensions.get("window").height;
const screenMultiplier: number = ((screenHeight / 1024) + (screenWidth/1366))/2;

// Define types for the Stack navigation
type StatsStackParamList = {
  BloodSugar: { data: BloodSugarData };
  BloodPressure: { data: BloodPressureData };
  Weight: { data: WeightData };
};

// Type for navigation prop
type StatsScreenNavigationProp = NavigationProp<StatsStackParamList>;

// Define the data structure types
interface BloodSugarData {
  // Define the properties you expect in blood sugar data
  [key: string]: any;
}

interface BloodPressureData {
  // Define the properties you expect in blood pressure data
  [key: string]: any;
}

interface WeightData {
  // Define the properties you expect in weight data
  [key: string]: any;
}

interface RouteProps {
  route: {
    params?: {
      data: any;
    };
  };
}

interface SidebarProps {
  bloodSugarData: BloodSugarData;
  bloodPressureData: BloodPressureData;
  weightData: WeightData;
}

interface MainLayoutProps {
  data: [BloodSugarData, BloodPressureData, WeightData];
}

const Stack = createStackNavigator<StatsStackParamList>();

const BloodSugar: React.FC<RouteProps> = ({ route }) => {
  return (
    <View style={styles.screen}>
      <BloodSugarScreen data={route.params?.data} />
    </View>
  );
};

const BloodPressure: React.FC<RouteProps> = ({ route }) => (
  <View style={styles.screen}>
    <BloodPressureScreen data={route.params?.data} />
  </View>
);

const Weight: React.FC<RouteProps> = ({ route }) => (
  <View style={styles.screen}>
    <WeightScreen data={route.params?.data} />
  </View>
);

const Sidebar: React.FC<SidebarProps> = ({ bloodSugarData, bloodPressureData, weightData }) => {
  const navigation = useNavigation<StatsScreenNavigationProp>();
  
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={() => navigation.navigate('BloodSugar', { data: bloodSugarData })}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Blood Sugar</Text>
          <Image
            style={styles.icon}
            source={require('../assets/images/bloodSugarSymbol.png')}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('BloodPressure', { data: bloodPressureData })}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Blood Pressure</Text>
          <Image
            style={styles.icon}
            source={require('../assets/images/bloodPressureSymbol.png')}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Weight', { data: weightData })}>
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
  const bloodSugarData = data[0];
  const bloodPressureData = data[1];
  const weightData = data[2];
  
  return (
    <View style={styles.container}>
      <Sidebar 
        bloodSugarData={bloodSugarData} 
        bloodPressureData={bloodPressureData} 
        weightData={weightData}
      />
      <View style={styles.content}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="BloodSugar"
            component={BloodSugar}
            initialParams={{ data: bloodSugarData }}
          />
          <Stack.Screen
            name="BloodPressure"
            component={BloodPressure}
            initialParams={{ data: bloodPressureData }}
          />
          <Stack.Screen
            name="Weight"
            component={Weight}
            initialParams={{ data: weightData }}
          />
        </Stack.Navigator>
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
    alignItems: 'flex-start',
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
    alignItems: 'flex-start',
  },
});