import { Text, View, Dimensions, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

import MainLayout from './StatsTabs';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const screenMultiplier = ((screenHeight / 1024) + (screenWidth/1366))/2

export default function StatsScreen({data}) {
  return (
    <View style={{flex:1}}>
      <StatsHeader></StatsHeader>
      <NavigationContainer>
        <MainLayout data={data}/>
      </NavigationContainer>
    </View>
  );
}
const StatsHeader = () => {
  return (
    <View style={{backgroundColor:'#B9CE88', flex:0.15, flexDirection:'row', padding:20, justifyContent:'space-around'}}>
      <BackArrow></BackArrow>
      <LastVisitTitle date="10/24/24"></LastVisitTitle>
      <HealthGoalsButton></HealthGoalsButton>
    </View>
  );
};
const BackArrow = () => {
  return (
    <View style={{flex:0.1, justifyContent: 'center'}}>
      <Icon
        name='left'
        type='antdesign'
        size='100'
      />
    </View>
  );
};
const LastVisitTitle = ({date}) => {
  return (
    <View style={styles.lastVisitContainer}>
      <Text style={styles.lastVisitText}>Last Visit: {date}</Text>
    </View>
  );
};
const HealthGoalsButton = () => {
  return (
    <View style={styles.healthGoalsContainer}>
      <Text style={styles.healthGoalsText}>Go To Health Goals</Text>
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
    padding:10 * screenMultiplier,
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