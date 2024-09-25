import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ParamListBase } from '@react-navigation/native';

// 맵 타일을 휴대폰 크기에 맞게 조정


// Stack Navigator에서 사용할 Param 타입 정의
interface RootStackParamList extends ParamListBase {
  Home: undefined;
}

// navigation 타입 지정
interface GameScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

// 10 X 10 맵 타일 만들기
const mapMatrix = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../image/arrow.webp')} style={{ width: 60, height: 60 }} />
        </TouchableOpacity>
        <Text style={styles.score}>0</Text>
      </View>

      {/* 타일 맵 그리기 */}
      <View style={styles.map}>
        {mapMatrix.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((tile, colIndex) => (
              <Image
              key={colIndex}
              source={tile === 1 ? require('../image/wall.webp') : require('../image/land.webp')}
              style={styles.tile}
            />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.operation}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    flex: 1,
    marginLeft: '5%',
    marginTop: '7%',
  },
  score: {
    color: "grey",
    marginRight: '5%',
    marginTop: '5%',
    fontSize: 55,
    fontWeight: '500',
  },
  map: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: 30,
    height: 30,
  },
  operation: {
    flex: 2.6,
  },
});

export default GameScreen;