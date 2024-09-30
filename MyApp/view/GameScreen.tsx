import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ParamListBase } from '@react-navigation/native';
import { colors } from './colors';

interface RootStackParamList extends ParamListBase {
  Home: undefined;
}

interface GameScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const initialPlayerPosition = { row: 7, col: 6 };
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
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);

  const movePlayer = (direction: string) => {
    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;

    // 벽 범위 내에 플레이어를 이동한다
    if (direction === 'up' && row > 2.5) newRow = row - 0.5;
    else if (direction === 'down' && row <= 11.0) newRow = row + 0.5;
    else if (direction === 'left' && col > 1.5) newCol = col - 0.5;
    else if (direction === 'right' && col <= 10.0) newCol = col + 0.5;

    setPlayerPosition({ row: newRow, col: newCol });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isGameStarted) {
      interval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameStarted]);

  const startGame = () => {
    setScore(0);
    setIsGameStarted(true);
    setPlayerPosition(initialPlayerPosition);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            setScore(0);
            setIsGameStarted(false);
            setPlayerPosition(initialPlayerPosition);
            navigation.navigate('Home');
          }}
        >
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

        {/* 플레이어를 타일 위에 그리기 */}
        <Image
          source={require('../image/player.webp')}
          style={[
            styles.player,
            {
              top: playerPosition.row * 30, // 타일 크기에 맞춰서 배치
              left: playerPosition.col * 30,
            },
          ]}
        />
      </View>

      {/* 게임 시작 버튼 및 방향키 */}
      <View style={styles.operation}>
        {!isGameStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startText}>게임 시작</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlPanel}>
            <View style={styles.controlRow}>
              <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('up')}>
                <Text style={styles.controlButtonText}>▲</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.controlRow}>
              <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('left')}>
                <Text style={styles.controlButtonText}>◀</Text>
              </TouchableOpacity>
              <View style={styles.controlSpacer} />
              <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('right')}>
                <Text style={styles.controlButtonText}>▶</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.controlRow}>
              <TouchableOpacity style={styles.controlButton} onPress={() => movePlayer('down')}>
                <Text style={styles.controlButtonText}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    flex: 1,
    marginLeft: '5%',
    marginTop: '10%',
  },
  score: {
    color: 'grey',
    marginRight: '5%',
    marginTop: '8%',
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
  player: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  operation: {
    flex: 2.6,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.buttonColor,
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
  controlPanel: {
    marginTop: '-7%',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 80,
    height: 80,
    backgroundColor: colors.metalicColor,
    borderWidth: 2,
    borderColor: colors.neonColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  controlButtonText: {
    color: colors.neonColor,
    fontSize: 32,
    fontWeight: 'bold',
  },
  controlSpacer: {
    width: 100,
    height: 100,
  },
});

export default GameScreen;
