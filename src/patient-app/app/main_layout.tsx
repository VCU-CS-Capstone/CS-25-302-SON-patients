import React, { useEffect } from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

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
  data: {
    bloodGlucose: BloodSugarData;
    bloodPressure: BloodPressureData;
    weight: WeightData;
  };
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
      params: { data: JSON.stringify(bloodPressureData) }
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
      params: { data: JSON.stringify(weightData) }
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

// Create a default content component
const DefaultContent = () => (
  <View style={styles.defaultContent}>
    <Text style={styles.defaultText}>Select a category from the sidebar</Text>
  </View>
);

const MainLayout: React.FC<MainLayoutProps> = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // // Redirect to blood-sugar by default if we're on the stats screen
  // useEffect(() => {
  //   if (pathname === '/stats_screen') {
  //     router.push({
  //       pathname: '/blood-sugar',
  //       params: { data: JSON.stringify(data.bloodGlucose) }
  //     });
  //   }
  // }, [pathname]);

  return (
    <View style={styles.container}>
      <Sidebar 
        bloodSugarData={data.bloodGlucose} 
        bloodPressureData={data.bloodPressure} 
        weightData={data.weight}
      />
      <View style={styles.content}>
        <DefaultContent />
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
  defaultContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultText: {
    fontSize: 24,
    color: '#666',
  },
  screen: {
    flex: 1,
    alignItems: 'flex-start',
  },
});