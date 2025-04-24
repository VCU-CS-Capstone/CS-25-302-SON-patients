import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity, Modal, UIManager, findNodeHandle } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useLocalSearchParams } from 'expo-router';

const screenWidth: number = Dimensions.get('window').width;
const screenHeight: number = Dimensions.get('window').height;
const screenMultiplier: number = (screenHeight / 1024 + screenWidth / 1366) / 2;

interface ChartDataset {
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface BloodPressureScreenProps {
  data: any;
  navigation: any;
}

interface ButtonPosition {
  buttonX: number;
  buttonY: number;
}

interface BloodPressurePopupProps {
  value: string | null;
  date: string | null;
  position: ButtonPosition;
}

export default function BloodPressureScreen(): JSX.Element {
  const params = useLocalSearchParams();
      const patientData = params.dataNew
          ? JSON.parse(params.dataNew as string)
          : null;
      const data = patientData
  
    const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }, { data: [] }],
  });

  const [upperModalVisible, setUpperModalVisible] = useState<boolean>(false);
  const [lowerModalVisible, setLowerModalVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [upperButtonPosition, setUpperButtonPosition] = useState<ButtonPosition>({
    buttonX: 0,
    buttonY: 0,
  });
  const upperButtonRefs = useRef<(TouchableOpacity | null)[]>([]);
  const [lowerButtonPosition, setLowerButtonPosition] = useState<ButtonPosition>({
    buttonX: 0,
    buttonY: 0,
  });
  const lowerButtonRefs = useRef<(TouchableOpacity | null)[]>([]);

  useEffect(() => {
      const section = data?.bloodPressure;
    
      if (
        section &&
        typeof section === 'object' &&
        Array.isArray(section.labels) &&
        Array.isArray(section.datasets) &&
        section.datasets.length > 0 &&
        Array.isArray(section.datasets[0].data)
      ) {
        if (JSON.stringify(chartData) !== JSON.stringify(section)) {
          setChartData(section);
        }
      }
    }, [data, chartData]);

  const chartHeight: number = 600 * screenMultiplier;
  const chartWidth: number = 850 * (chartHeight / 600);
  const upperData: number[] = chartData.datasets?.[0]?.data || [];
  const lowerData: number[] = chartData.datasets?.[1]?.data || [];

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphHeader}>Sitting Blood Pressure</Text>
      <Text style={styles.graphText}>
        Last Visit: {chartData?.datasets?.[0]?.data?.at(-1) ?? ' '}/{chartData?.datasets?.[1]?.data?.at(-1) ?? ' '} mmHg
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
        {/* x axis overlay */}
        <View style={{ flexDirection: 'row' }}>
          {upperData.map((value, index) => {
            const x = 54 + chartWidth * 0.45 * (index / upperData.length);
            const y = chartHeight * 0.85;
            return (
              <Text key={`x-axis-${index}`} style={{ left: x, top: y, fontWeight: 'bold', fontSize: 24 }}>
                {chartData.labels[index].substring(5)}
              </Text>
            );
          })}
        </View>
        {/* y axis overlay */}
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
              <Text key={`y-axis-${index}`} style={{ left: x, top: y, fontWeight: 'bold', fontSize: 24 }}>
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
              <View key={`upper-dot-container-${index}`}>
                <View style={[styles.fakeDot, { left: x - 20, top: y - 20 }]} />
                <TouchableOpacity
                  key={`upper-button-${index}`}
                  ref={(el) => (upperButtonRefs.current[index] = el)}
                  onPressIn={() => {
                    if (upperButtonRefs.current[index]) {
                      const node = findNodeHandle(upperButtonRefs.current[index]);
                      if (node) {
                        UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
                          setUpperButtonPosition({
                            buttonX: pageX - 140,
                            buttonY: pageY - 200,
                          });
                          setUpperModalVisible(true);
                          setSelectedValue(value + '/' + lowerData[index]);
                          setLabel(chartData.labels[index]);
                        });
                      }
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
          <BloodPressurePopupUpper
            value={selectedValue}
            date={label}
            position={upperButtonPosition}
          />
        </Modal>
        {/* Lower Buttons */}
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
              <View key={`lower-dot-container-${index}`}>
                <View style={[styles.fakeDot, { left: x - 20, top: y - 20 }]} />
                <TouchableOpacity
                  key={`lower-button-${index}`}
                  ref={(el) => (lowerButtonRefs.current[index] = el)}
                  onPressIn={() => {
                    if (lowerButtonRefs.current[index]) {
                      const node = findNodeHandle(lowerButtonRefs.current[index]);
                      if (node) {
                        UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
                          setLowerButtonPosition({
                            buttonX: pageX - 140,
                            buttonY: pageY - 200,
                          });
                          setLowerModalVisible(true);
                          setSelectedValue(upperData[index] + '/' + value);
                          setLabel(chartData.labels[index]);
                        });
                      }
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
        <BloodPressurePopupLower
          value={selectedValue}
          date={label}
          position={lowerButtonPosition}
        />
      </Modal>
    </View>
  );
}

const BloodPressurePopupUpper = ({ value, date, position }: BloodPressurePopupProps): JSX.Element => {
  return (
    <View style={{ left: position.buttonX, top: position.buttonY }}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{date}</Text>
        <Text style={styles.modalText}>{value} mmHg</Text>
      </View>
    </View>
  );
};

const BloodPressurePopupLower = ({ value, date, position }: BloodPressurePopupProps): JSX.Element => {
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