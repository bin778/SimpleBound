import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ParamListBase } from '@react-navigation/native';

// 게임 컴포넌트
import { colors } from './Component/colors';
import { initialPlayerPosition, mapMatrix } from './Component/MapMatrix';
import ControlKey from './Component/ControlKey';
import MapPaint from './Component/MapPaint';

interface RootStackParamList extends ParamListBase {
  Home: undefined;
  Result: { score: number };
}

interface GameScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);
  const [bombs, setBombs] = useState<{ row: number, col: number, explode: boolean, affectedTiles?: { row: number, col: number }[] }[]>([]);

  // 피격 시간, 폭발 시간, 폭탄 생성 시간
  const [explodeHit, setExplodeHit] = useState(500);
  const [explodeTime, setExplodeTime] = useState(2000);
  const [creationTime, setCreationTime] = useState(2000);

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
        affectedTiles: [],
      };
      setBombs((prevBombs) => [...prevBombs, newBomb]);

      setTimeout(() => {
        // 십자 범위로 폭발 처리
        setBombs((prevBombs) =>
          prevBombs.map((bomb) => {
            if (bomb === newBomb) {
              const affectedTiles = [
                { row: bomb.row, col: bomb.col }, // 폭탄 위치
                { row: bomb.row - 1, col: bomb.col }, // 위
                { row: bomb.row + 1, col: bomb.col }, // 아래
                { row: bomb.row, col: bomb.col - 1 }, // 왼쪽
                { row: bomb.row, col: bomb.col + 1 }, // 오른쪽
              ].filter(({ row, col }) => mapMatrix[row] && mapMatrix[row][col] === 0); // 바닥 타일만 포함
              return { ...bomb, explode: true, affectedTiles };
            }
            return bomb;
          })
        );

        setTimeout(() => {
          setBombs((prevBombs) => prevBombs.slice(1)); // 폭탄 제거
        }, explodeHit); // 플레이어가 닿으면 피격
      }, explodeTime); // 폭탄 생성 후 폭발
    }, creationTime); // 새로운 폭탄 생성
  };

  // 게임 스테이지 구현
  useEffect(() => {
    if (score >= 150 && stage === 1) { // 2스테이지
      setCreationTime(1000);
      setStage(2);
    } else if (score >= 300 && stage === 2) { // 3스테이지
      setExplodeHit(750);
      setCreationTime(700);
      setStage(3);
    } else if (score >= 450 && stage === 3) { // 4 스테이지
      setCreationTime(500);
      setStage(4);
    } else if (score >= 600 && stage === 4) { // 5 스테이지
      setExplodeHit(1000);
      setExplodeTime(1000);
      setStage(5);
    } else if (score >= 750 && stage === 5) { // 6 스테이지
      setCreationTime(250);
      setStage(6);
    } else if (score >= 900 && stage === 6) { // 7 스테이지
      setExplodeHit(1200);
      setCreationTime(150);
      setStage(7);
    }
  }, [score, stage]);

  // 점수 및 폭발 처리 이펙트 구현
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
  }, [isGameStarted, explodeHit, explodeTime, creationTime]);

  // 게임 시작
  const startGame = () => {
    setIsGameStarted(true);
  };

  // 게임 리셋
  const resetGame = () => {
    setScore(0);
    setStage(1);
    setExplodeHit(500);
    setExplodeTime(2000);
    setCreationTime(2000);
    setPlayerPosition(initialPlayerPosition);
    setBombs([]);
    setIsGameStarted(false);
  }

  // 플레이어 피격 처리 이펙트 구현
  useEffect(() => {
    // 플레이어가 폭발 범위에 있는지 확인
    const isPlayerHit = bombs.some(bomb => bomb.explode && bomb.affectedTiles?.some(tile => 
      tile.row === playerPosition.row && tile.col === playerPosition.col
    ));

    // 폭발 범위에 있으면 게임 오버 처리
    if (isPlayerHit) {
      resetGame();
      navigation.navigate('Result', { score });
    }
  }, [bombs, playerPosition])

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            resetGame();
            navigation.navigate('Home');
          }}
        >
          <Image source={require('../image/arrow.webp')} style={{ width: 60, height: 60 }} />
        </TouchableOpacity>
        <Text style={styles.score}>{score}</Text>
      </View>

      {/* 맵 그리기 */}
      <MapPaint 
        mapMatrix={mapMatrix} 
        playerPosition={playerPosition} 
        bombs={bombs} 
      />

      {/* 게임 시작 버튼 및 방향키 */}
      <View style={styles.operation}>
        {!isGameStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startText}>게임 시작</Text>
          </TouchableOpacity>
        ) : (
          <ControlKey playerPosition={playerPosition} setPlayerPosition={setPlayerPosition} />
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
});

export default GameScreen;
