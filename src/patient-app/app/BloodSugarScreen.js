import React, { useEffect, useState, useRef } from "react";
import { Text, View, Dimensions, StyleSheet, TouchableOpacity, Modal, UIManager, findNodeHandle } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const screenMultiplier = ((screenHeight / 1024) + (screenWidth/1366))/2

export default function BloodSugarScreen({ data, navigation }) {
  console.log(data);
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [label, setLabel] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRefs = useRef([]);

  useEffect(() => {
    if (data) {
      const normalizedData = data.bloodSugarData ? data.bloodSugarData : data;
      if (
        typeof normalizedData === "object" &&
        Array.isArray(normalizedData.labels) &&
        Array.isArray(normalizedData.datasets) &&
        normalizedData.datasets.length > 0 &&
        Array.isArray(normalizedData.datasets[0].data)
      ) {
        setChartData(normalizedData);
      }
    }
  }, [data]);

  const chartHeight = 600 * screenMultiplier;
  const chartWidth = 850 * (chartHeight / 600);
  const dataPoints = chartData.datasets[0].data || [];

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphHeader}>Blood Sugar</Text>
      <Text style={styles.graphText}>Last Visit: {chartData?.datasets?.[0]?.data?.at(-1) ?? " "} mg/dL</Text>
      <View>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: () => `rgba(255, 0, 0, 1)`,
            strokeWidth: 7,
            decimalPlaces: 0,
            labelColor: (opacity = .5) => `rgba(255, 255, 255, ${opacity})`,
            propsForLabels: {
              fontSize: 24,
              fontWeight: "bold",
            },
          }}
          withShadow={false}
          withInnerLines={false}
          withDots={false} // Hide default dots
          style={{ position: "absolute" , flex:1, padding:20}}
        />

        //x axis overlay
        <View style={{flexDirection:'row'}}>
          {dataPoints.map((value, index) => {
            const x = 54 + ((chartWidth * .555) * (index / dataPoints.length));
            const y = chartHeight * .85;
            return (
              <Text style={{left:x, top:y, fontWeight:'bold', fontSize:24}}>{chartData.labels[index]}</Text>
            )
          })}
        </View>

        //y axis overaly
        <View style={{flexDirection:'column'}}>
          {dataPoints.map((value, index) => {
            const x = 0
            const y = (chartHeight * 0.72) - ((chartHeight * 1.2) * (index / dataPoints.length));
            const axisValue = Math.round(Math.min(...dataPoints) + (((Math.max(...dataPoints) - Math.min(...dataPoints)) / (dataPoints.length - 1)) * index))
            return (
              <Text style={{left:x, top:y, fontWeight:'bold', fontSize:24}}>{axisValue}</Text>
            )
          })}
        </View>
        
        {/* Overlay Buttons */}
        <View style={StyleSheet.absoluteFill}>
          {dataPoints.map((value, index) => {
            const xmin = chartWidth*.1;
            const xmax = chartWidth - chartWidth*.17;
            const x = xmin + ((index / (dataPoints.length-1)) * (xmax - xmin));
            const ymin = chartHeight*.06;
            const ymax = chartHeight - chartHeight*.2;
            const y = ymax - (((value - Math.min(...dataPoints)) / (Math.max(...dataPoints) - Math.min(...dataPoints))) * (ymax - ymin));

            return (
              <View>
              <View style={[styles.fakeDot, { left: x - 20, top: y - 20 }]}/>
              <TouchableOpacity
                key={index}
                ref={(el) => (buttonRefs.current[index] = el)} 
                onPressIn={() => {
                  if (buttonRefs.current[index]) {
                    buttonRefs.current[index].measure(
                      (x, y, width, height, pageX, pageY) => {
                        setButtonPosition({ buttonX: pageX - 140, buttonY: pageY - 200 }); // Adjust modal position below button
                        setModalVisible(true);
                        setSelectedValue(value);
                        setLabel(chartData.labels[index])
                      }
                    );
                  }
                }}
                onPressOut={() => setModalVisible(false)}
                style={[styles.point, { left: x - 10, top: y - 10 }]}
              >
                <View style={styles.dot} />
              </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Modal for showing the selected value */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BloodSugarPopup value={selectedValue} date={label} position={buttonPosition}  />
      </Modal>
    </View>
  );
}

const BloodSugarPopup = ({ value, date, position}) => {
  return (
    <View style={{left: position.buttonX, top: position.buttonY}}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{date}</Text>
        <Text style={styles.modalText}>{value} mg/dL</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  point: {
    position: "absolute",
    width: 20 * screenMultiplier,
    height: 20 * screenMultiplier,
    alignItems: "center",
    justifyContent: "center"
  },
  fakeDot: {
    position: 'absolute',
    width: 50 * screenMultiplier,
    height: 50 * screenMultiplier,
    borderRadius: 25,
    backgroundColor: "#000000",
  },
  dot: {
    width: 150 * screenMultiplier,
    height: 150 * screenMultiplier,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    opacity: .2
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300 * screenMultiplier,
    padding: 20 * screenMultiplier,
    backgroundColor: "white",
    borderRadius: 20 * screenMultiplier,
    alignItems: "center",
    borderColor: "#B9CE88",
    borderWidth: 10
  },
  graphHeader: {
    fontSize: 60 * screenMultiplier,
    fontWeight: 'bold'
  },
  graphText: {
    fontSize: 40 * screenMultiplier
  },
  graphContainer: {
    padding: 20 * screenMultiplier,
    flex:1,
    justifyContent: 'left',
    rowGap:10 * screenMultiplier,
    backgroundColor: 'white'
  },
  modalText: {
    fontSize: 36 * screenMultiplier,
  }
});
