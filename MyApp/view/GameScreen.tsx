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

const initialPlayerPosition = { row: 5, col: 6 };
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
  const [bombs, setBombs] = useState<{ row: number, col: number, explode: boolean }[]>([]);

  // 플레이어 이동 함수
  const movePlayer = (direction: string) => {
    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;

    if (direction === 'up' && mapMatrix[row - 1][col] === 0) newRow = row - 1;
    else if (direction === 'down' && mapMatrix[row + 1][col] === 0) newRow = row + 1;
    else if (direction === 'left' && mapMatrix[row][col - 1] === 0) newCol = col - 1;
    else if (direction === 'right' && mapMatrix[row][col + 1] === 0) newCol = col + 1;

    setPlayerPosition({ row: newRow, col: newCol });
  };

  // 점수 증가 처리 함수
  const startScoreInterval = () => {
    return setInterval(() => {
      setScore((prevScore) => prevScore + 1);
    }, 100);
  };

  // 폭탄 및 폭발 처리 함수
  const startBombInterval = () => {
    return setInterval(() => {
      const newBomb = {
        row: Math.floor(Math.random() * 10) + 1,
        col: Math.floor(Math.random() * 10) + 1,
        explode: false,
      };
      setBombs((prevBombs) => [...prevBombs, newBomb]);

      setTimeout(() => {
        setBombs((prevBombs) =>
          prevBombs.map((bomb, index) =>
            index === prevBombs.length - 1 ? { ...bomb, explode: true } : bomb
          )
        );

        setTimeout(() => {
          setBombs((prevBombs) => prevBombs.slice(1)); // 폭탄 제거
        }, 500);
      }, 2000);
    }, 3000); // 3초마다 새로운 폭탄 생성
  };

  useEffect(() => {
    let scoreInterval: NodeJS.Timeout | null = null;
    let bombInterval: NodeJS.Timeout | null = null;

    if (isGameStarted) {
      scoreInterval = startScoreInterval();
      bombInterval = startBombInterval();
    }

    return () => {
      if (scoreInterval) clearInterval(scoreInterval);
      if (bombInterval) clearInterval(bombInterval);
    };
  }, [isGameStarted]);

  const startGame = () => {
    setIsGameStarted(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            setScore(0);
            setPlayerPosition(initialPlayerPosition);
            setBombs([]);
            setIsGameStarted(false);
            navigation.navigate('Home');
          }}
        >
          <Image source={require('../image/arrow.webp')} style={{ width: 60, height: 60 }} />
        </TouchableOpacity>
        <Text style={styles.score}>{score}</Text>
      </View>

      {/* 맵 그리기 */}
      <View style={styles.map}>
        {mapMatrix.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((tile, colIndex) => {
              const isPlayer = rowIndex === playerPosition.row && colIndex === playerPosition.col;
              const isBomb = bombs.find(bomb => bomb.row === rowIndex && bomb.col === colIndex);

              if (isPlayer) {
                return <Image key={colIndex} source={require('../image/player.webp')} style={styles.tile} />;
              }

              if (isBomb) {
                return (
                  <Image
                    key={colIndex}
                    source={isBomb.explode ? require('../image/explosion.webp') : require('../image/bomb.webp')}
                    style={styles.tile}
                  />
                );
              }

              return (
                <Image
                  key={colIndex}
                  source={tile === 1 ? require('../image/wall.webp') : require('../image/land.webp')}
                  style={styles.tile}
                />
              );
            })}
          </View>
        ))}
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
