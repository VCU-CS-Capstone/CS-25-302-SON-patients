import {useEffect, useState, useRef} from 'react';
import {Text, View, Dimensions, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const screenMultiplier = (screenHeight / 1024 + screenWidth / 1366) / 2;

export default function BloodPressureScreen({ data, navigation }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [upperModalVisible, setUpperModalVisible] = useState(false);
  const [lowerModalVisible, setLowerModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [label, setLabel] = useState(null);
  const [upperButtonPosition, setUpperButtonPosition] = useState({
    x: 0,
    y: 0,
  });
  const upperButtonRefs = useRef([]);
  const [lowerButtonPosition, setLowerButtonPosition] = useState({
    x: 0,
    y: 0,
  });
  const lowerButtonRefs = useRef([]);

  useEffect(() => {
    if (data) {
      const normalizedData = data.bloodSugarData ? data.bloodSugarData : data;
      if (
        typeof normalizedData === 'object' &&
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
  const upperData = data.datasets[0].data || [];
  const lowerData = data.datasets[1].data || [];

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphHeader}>Blood Pressure</Text>
      <Text style={styles.graphText}>
        Last Visit: {chartData?.datasets?.[0]?.data?.at(-1) ?? ' '} mmHg
      </Text>
      <View>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => `rgba(255, 0, 0, 1)`,
            strokeWidth: 7,
            decimalPlaces: 0,
            labelColor: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
            propsForLabels: {
              fontSize: 24,
              fontWeight: 'bold',
            },
          }}
          withShadow={false}
          withInnerLines={false}
          withDots={false} // Hide default dots
          style={{ position: 'absolute', flex: 1, padding: 20 }}
        />
        //x axis overlay
        <View style={{ flexDirection: 'row' }}>
          {upperData.map((value, index) => {
            const x = 54 + chartWidth * 0.555 * (index / upperData.length);
            const y = chartHeight * 0.85;
            return (
              <Text
                style={{ left: x, top: y, fontWeight: 'bold', fontSize: 24 }}>
                {chartData.labels[index]}
              </Text>
            );
          })}
        </View>
        //y axis overaly
        <View style={{ flexDirection: 'column' }}>
          {upperData.map((value, index) => {
            const x = 0;
            const y =
              chartHeight * 0.72 -
              chartHeight * 1.2 * (index / upperData.length);
            const axisValue = Math.round(
              Math.min(...lowerData) +
                ((Math.max(...upperData) - Math.min(...lowerData)) /
                  (upperData.length - 1)) *
                  index
            );
            return (
              <Text
                style={{ left: x, top: y, fontWeight: 'bold', fontSize: 24 }}>
                {axisValue}
              </Text>
            );
          })}
        </View>
        {/* Overlay Upper Buttons */}
        <View style={StyleSheet.absoluteFill}>
          {upperData.map((value, index) => {
            const xmin = chartWidth * 0.1;
            const xmax = chartWidth - chartWidth * 0.17;
            const x = xmin + (index / (upperData.length - 1)) * (xmax - xmin);
            const ymin = chartHeight * 0.06;
            const ymax = chartHeight - chartHeight * 0.2;
            const y =
              ymax -
              ((value - Math.min(...lowerData)) /
                (Math.max(...upperData) - Math.min(...lowerData))) *
                (ymax - ymin);
            return (
              <View>
                <View style={[styles.fakeDot, { left: x - 20, top: y - 20 }]} />
                <TouchableOpacity
                  key={index}
                  ref={(el) => (upperButtonRefs.current[index] = el)}
                  onPressIn={() => {
                    if (upperButtonRefs.current[index]) {
                      upperButtonRefs.current[index].measure(
                        (x, y, width, height, pageX, pageY) => {
                          setUpperButtonPosition({
                            buttonX: pageX - 140,
                            buttonY: pageY - 200,
                          }); // Adjust modal position below button
                          setUpperModalVisible(true);
                          setSelectedValue(value + '/' + lowerData[index]);
                          setLabel(chartData.labels[index]);
                        }
                      );
                    }
                  }}
                  onPressOut={() => setUpperModalVisible(false)}
                  style={[styles.point, { left: x - 10, top: y - 10 }]}>
                  <View style={styles.dot} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={upperModalVisible}
          onRequestClose={() => setUpperModalVisible(false)}>
          <BloodSugarPopupUpper
            value={selectedValue}
            date={label}
            position={upperButtonPosition}
          />
        </Modal>
        //Lower Buttons
        <View style={StyleSheet.absoluteFill}>
          {lowerData.map((value, index) => {
            const xmin = chartWidth * 0.1;
            const xmax = chartWidth - chartWidth * 0.17;
            const x = xmin + (index / (upperData.length - 1)) * (xmax - xmin);
            const ymin = chartHeight * 0.06;
            const ymax = chartHeight - chartHeight * 0.2;
            const y =
              ymax -
              ((value - Math.min(...lowerData)) /
                (Math.max(...upperData) - Math.min(...lowerData))) *
                (ymax - ymin);

            return (
              <View>
                <View style={[styles.fakeDot, { left: x - 20, top: y - 20 }]} />
                <TouchableOpacity
                  key={index}
                  ref={(el) => (lowerButtonRefs.current[index] = el)}
                  onPressIn={() => {
                    if (lowerButtonRefs.current[index]) {
                      lowerButtonRefs.current[index].measure(
                        (x, y, width, height, pageX, pageY) => {
                          setLowerButtonPosition({
                            buttonX: pageX - 140,
                            buttonY: pageY - 200,
                          }); // Adjust modal position below button
                          setLowerModalVisible(true);
                          setSelectedValue(upperData[index] + '/' + value);
                          setLabel(chartData.labels[index]);
                        }
                      );
                    }
                  }}
                  onPressOut={() => setLowerModalVisible(false)}
                  style={[styles.point, { left: x - 10, top: y - 10 }]}>
                  <View style={styles.dot} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={lowerModalVisible}
        onRequestClose={() => setLowerModalVisible(false)}>
        <BloodSugarPopupLower
          value={selectedValue}
          date={label}
          position={lowerButtonPosition}
        />
      </Modal>
    </View>
  );
}

const BloodSugarPopupUpper = ({ value, date, position }) => {
  return (
    <View style={{ left: position.buttonX, top: position.buttonY }}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{date}</Text>
        <Text style={styles.modalText}>{value} mmHg</Text>
      </View>
    </View>
  );
};

const BloodSugarPopupLower = ({ value, date, position }) => {
  return (
    <View style={{ left: position.buttonX, top: position.buttonY }}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{date}</Text>
        <Text style={styles.modalText}>{value} mmHg</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  point: {
    position: 'absolute',
    width: 20 * screenMultiplier,
    height: 20 * screenMultiplier,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeDot: {
    position: 'absolute',
    width: 50 * screenMultiplier,
    height: 50 * screenMultiplier,
    borderRadius: 25,
    backgroundColor: '#000000',
  },
  dot: {
    width: 150 * screenMultiplier,
    height: 150 * screenMultiplier,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 350 * screenMultiplier,
    padding: 20 * screenMultiplier,
    backgroundColor: 'white',
    borderRadius: 20 * screenMultiplier,
    alignItems: 'center',
    borderColor: '#B9CE88',
    borderWidth: 10,
  },
  graphHeader: {
    fontSize: 60 * screenMultiplier,
    fontWeight: 'bold',
  },
  graphText: {
    fontSize: 40 * screenMultiplier,
  },
  graphContainer: {
    padding: 20 * screenMultiplier,
    flex: 1,
    justifyContent: 'left',
    rowGap: 10 * screenMultiplier,
    backgroundColor: 'white',
  },
  modalText: {
    fontSize: 36 * screenMultiplier,
  },
});
