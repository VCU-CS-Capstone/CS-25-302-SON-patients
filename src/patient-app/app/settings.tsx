import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { CheckBox } from 'react-native-elements';


export default function SettingsScreen() {
 const [fontSize, setFontSize] = useState(16);
 const [highContrast, setHighContrast] = useState(false);
 const [dictation, setDictation] = useState(false);
 const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);


 useEffect(() => {
   const updateDimensions = () => {
     const { width } = Dimensions.get('window');
     setScreenWidth(width);
   };


   const subscription = Dimensions.addEventListener('change', updateDimensions);
  
   // Unsubscribe on cleanup
   return () => subscription.remove(); // Correctly remove the listener
 }, []);


 // Define color schemes
 const COLORS = {
   default: {
     header: '#B9CE88',
     track: '#ccc',
     thumb: 'black',
     checkbox: '#B9CE88',
     background: 'white',
     text: 'black',
   },
   highContrast: {
     header: '#A4E30E', // Bright green
     track: 'black',
     thumb: '#A4E30E',
     checkbox: '#black',
     background: 'white',
     text: 'black',
   },
 };


 // Determine current color scheme
 const currentColors = highContrast ? COLORS.highContrast : COLORS.default;


 return (
   <View style={[styles.container, { backgroundColor: currentColors.background }]}>
     {/* Header */}
     <View style={[styles.header, { backgroundColor: currentColors.header }]}>
       <Text style={[styles.headerText, { color: currentColors.text }]}>Settings</Text>
     </View>


     <View style={styles.settingContainer}>
       <Text style={[styles.settingHeader, { color: currentColors.text }]}>Font Size</Text>
       <View style={[styles.sliderWrapper, { width: screenWidth * 0.29 }]}>
         <Slider
           style={styles.slider}
           minimumValue={12}
           maximumValue={24}
           step={1}
           value={fontSize}
           onValueChange={setFontSize}
           minimumTrackTintColor={currentColors.track}
           maximumTrackTintColor={currentColors.track}
           thumbTintColor={currentColors.thumb}
         />
       </View>
     </View>


     <View style={styles.settingContainer}>
       <Text style={[styles.settingHeader, { color: currentColors.text }]}>High Contrast</Text>
       <CheckBox
         checked={highContrast}
         onPress={() => setHighContrast(!highContrast)}
         checkedColor={currentColors.checkbox}
         uncheckedColor={currentColors.checkbox}
         containerStyle={styles.checkbox}
         size={100}
       />
     </View>


     <View style={styles.settingContainer}>
       <Text style={[styles.settingHeader, { color: currentColors.text }]}>Dictation</Text>
       <CheckBox
         checked={dictation}
         onPress={() => setDictation(!dictation)}
         checkedColor={currentColors.checkbox}
         uncheckedColor={currentColors.checkbox}
         containerStyle={styles.checkbox}
         size={100}
       />
     </View>
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
 },
 header: {
   width: '100%', // Ensures the header bar takes up full width
   alignItems: 'center',
   justifyContent: 'center',
   height: 150, // Height of the header bar
 },
 headerText: {
   fontSize: 80,
 },
 settingContainer: {
   flex: 1,
   justifyContent: 'center',
   paddingVertical: 20,
 },
 settingHeader: {
   fontSize: 50,
   fontWeight: 'bold',
   textAlign: 'left',
   marginBottom: 10,
   paddingLeft: 30,
 },
 sliderWrapper: {
   justifyContent: 'center',
   alignItems: 'center',
   alignSelf: 'center',
   width: '100%',
   paddingHorizontal: 15,
 },
 slider: {
   width: '100%',
   height: 80, // Increases the track height
   borderRadius: 5, // Optional: makes the track rounded
   transform: [{ scaleX: 4 }, { scaleY: 4 }],
 },
 checkbox: {
   backgroundColor: 'transparent',
   borderWidth: 0,
   padding: 0,
   paddingLeft: 80,
 },
});
