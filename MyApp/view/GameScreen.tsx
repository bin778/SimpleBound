import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ParamListBase } from '@react-navigation/native';

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
  const [score, setScore] = useState(0); // 점수는 0으로 초기화
  const [isGameStarted, setIsGameStarted] = useState(false);  // 게임 시작 여부 상태

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isGameStarted) {
      interval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);  // 1초에 10씩 증가
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);  // 컴포넌트가 언마운트되면 interval 정리
    };
  }, [isGameStarted]);

  const startGame = () => {
    setScore(0);  // 게임 시작 시 점수를 0으로 초기화
    setIsGameStarted(true);  // 게임 시작
  };

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={() => {
            setScore(0); // 점수를 0으로 초기화
            setIsGameStarted(false); // 게임 종료
            navigation.navigate('Home'); // 홈 화면으로 이동
          }}>
          <Image source={require('../image/arrow.webp')} style={{ width: 60, height: 60 }} />
        </TouchableOpacity>
        <Text style={styles.score}>{score}</Text>
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

      {/* 게임 시작 버튼 */}
      <View style={styles.operation}>
        {!isGameStarted && (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startText}>게임 시작</Text>
          </TouchableOpacity>
        )}
      </View>
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
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: '20%',
  },
  startText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default GameScreen;