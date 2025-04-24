import React from 'react';
import { Stack, useRouter, Slot, useLocalSearchParams, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Icon } from 'react-native-elements';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const screenMultiplier = ((screenHeight / 1024) + (screenWidth / 1366)) / 2;

const tabs = [
  { name: '', label: 'Blood Glucose', image: require('../../assets/images/bloodSugarSymbol.png')},
  { name: 'blood_pressure', label: 'Blood Pressure', image: require('../../assets/images/bloodPressureSymbol.png')},
  { name: 'weight', label: 'Weight', image: require('../../assets/images/weightSymbol.png')},
];

export default function Layout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('index');
  const params = useLocalSearchParams();
  const patientData = params.patientData
    ? JSON.parse(params.patientData as string)
    : null;

    const handleBackPress = () => {
        router.back();
        };

    const handleHealthGoalsPress = () => {
    router.push({
        pathname: '/health_goals',
        params: { patientData: params.patientData },
    });
    };

    const BackArrow = (): JSX.Element => {
        return (
          <View style={{ justifyContent: 'center' }}>
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

  const calculateLength = (length) => {if (length <= 10) {return length} else {return 10}}
  const bloodGlucose = patientData.bloodGlucoseHistory.data || null
  const bloodGlucoseLength = calculateLength(patientData.bloodGlucoseHistory.total)
  const bloodGlucoseDates = bloodGlucose.map((value, index) => bloodGlucose[bloodGlucoseLength-index-1].date_of_visit)
  const bloodGlucoseValues = bloodGlucose.map((value, index) => bloodGlucose[bloodGlucoseLength-index-1].result)
  const bloodGlucoseNew = {labels: bloodGlucoseDates.slice(-5), datasets: [{data: bloodGlucoseValues.slice(-5)}]}

  const bloodPressure = patientData.bloodPressureHistory.data || null
  const bloodPressureLength = calculateLength(patientData.bloodPressureHistory.total)
  const bloodPressureDates = bloodPressure.map((value, index) => bloodPressure[bloodPressureLength-index-1].date_of_visit)
  const bloodPressureHigh = bloodPressure.map((value, index) => bloodPressure[bloodPressureLength-index-1].readings.sit.systolic)
  const bloodPressureLow = bloodPressure.map((value, index) => bloodPressure[bloodPressureLength-index-1].readings.sit.diastolic)
  const bloodPressureNew = {labels: bloodPressureDates.slice(-5), datasets: [{data: bloodPressureHigh.slice(-5)}, {data: bloodPressureLow.slice(-5)}]}

  const weight = patientData.weightHistory.data || null
  const weightLength = calculateLength(patientData.weightHistory.total)
  const weightDates = weight.map((value, index) => weight[weightLength-index-1].date_of_visit)
  const weightValues = weight.map((value, index) => weight[weightLength-index-1].weight)
  const weightNew = {labels: weightDates.slice(-5), datasets: [{data: weightValues.slice(-5)}]}

  const dataNew = {bloodGlucose: bloodGlucoseNew, bloodPressure: bloodPressureNew, weight: weightNew}
  const lastVisitDate = patientData?.last_visited || bloodGlucose[0].date_of_visit || bloodPressure[0].date_of_visit || weight[0].date_of_visit || "N/A";

  const pathname = usePathname();
  useEffect(() => {
    if (pathname === '/stats-screen-tabs') {
      router.replace({ pathname: '/stats-screen-tabs', params: { dataNew: JSON.stringify(dataNew) } });
    }
  }, []);
  return (
    <View style={{ flex: 1 }}>
        {/*Header*/}
        <View style={{ flex: .15 }}>
            <View style={styles.header}>
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
        </View>
        {/*Main Content*/}
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={styles.sidebar}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.name}
                        onPress={() => {
                            setActiveTab(tab.name);
                            router.replace({ pathname: `stats-screen-tabs/${tab.name}`, params: { dataNew: JSON.stringify(dataNew) }});
                            }}
                        style={styles.buttonContainer}
                    >
                    <Image source={tab.image} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ flex: 1 }}>
                <Slot />
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#B9CE88',
    padding: 20 * screenMultiplier,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
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
  sidebar: {
      backgroundColor: '#B9CE88',
      paddingHorizontal: 25 * screenMultiplier,
      width: '30%',
      justifyContent: 'space-around',
      paddingBottom: 20 * screenMultiplier,
      alignItems: 'flex-start',
    },
    buttonContainer: {
        backgroundColor: 'white',
        padding: 20 * screenMultiplier,
        borderRadius: 30 * screenMultiplier,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
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
    buttonIcon: {
      height: 80 * screenMultiplier,
      width: 150 * screenMultiplier,
      resizeMode: 'contain',
    },
    buttonText: {
      color: 'black',
      fontSize: 40,
      marginVertical: 10 * screenMultiplier,
    },
});
