import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RootStackParamList extends ParamListBase {
  Home: undefined;
  Result: { score: number };
}

interface ResultScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

interface Ranking {
  name: string;
  score: number;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const { score } = route.params;
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isInTopFive, setIsInTopFive] = useState(false);
  const [isNotRegistered, setIsNotRegistered] = useState(true);

  useEffect(() => {
    loadRankings();
  }, []);

  // 랭킹 불러오기
  const loadRankings = async () => {
    try {
      const storedRankings = await AsyncStorage.getItem('rankings');
      if (storedRankings) {
        setRankings(JSON.parse(storedRankings));
      }
    } catch (error) {
      console.error('랭킹 불러오기 에러:', error);
    }
  };

  // 랭킹 저장하기
  const saveRankings = async (updatedRankings: Ranking[]) => {
    try {
      await AsyncStorage.setItem('rankings', JSON.stringify(updatedRankings));
      setRankings(updatedRankings);
    } catch (error) {
      console.error('랭킹 저장하기 에러:', error);
    }
  };

  // 랭킹 등록하기
  const handleSaveRanking = () => {
    const newRanking: Ranking = { name: playerName, score };
    const updatedRankings = [...rankings, newRanking]
      .sort((a, b) => b.score - a.score) // 내림차순 순으로 점수 정렬
      .slice(0, 5); // 상위 5위까지 출력

    saveRankings(updatedRankings);
    setIsNotRegistered(false); // 랭킹 등록 여부 확인
    setIsInTopFive(false);
  };

  // 랭킹 초기화하기
  const resetRankings = async () => {
    try {
      await AsyncStorage.removeItem('rankings'); // AsyncStorage에서 랭킹 데이터 삭제
      setRankings([]); // 로컬 상태에서도 초기화
    } catch (error) {
      console.error('랭킹 초기화 에러:', error);
    }
  };

  // 플레이어가 상위 5위 안에 드는지 확인
  useEffect(() => {
    if (rankings.length < 5 || score > rankings[rankings.length - 1].score) {
      setIsInTopFive(true);
    }
  }, [rankings, score]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>당신의 점수는?</Text>
        <Text style={styles.score}>{score}점</Text>
      </View>
      {/* 점수가 5위 안에 들고 한 번만 랭킹 등록 가능(한번 랭킹이 등록되면 다시 등록 불가) */}
      {isInTopFive && isNotRegistered && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이름을 입력하세요!</Text>
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={playerName}
            onChangeText={setPlayerName}
          />
          <TouchableOpacity onPress={handleSaveRanking}>
            <Text style={styles.saveButton}>등록</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* 1~5위 까지의 가장 높은 점수의 랭킹을 보여주기 */}
      <View style={styles.rankingsContainer}>
        <FlatList
          data={rankings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.rankingItem}>
              <Text style={styles.rankingText}>
                {index + 1}위 {item.name} {item.score}점
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.footer}>
        {/* 랭킹 초기화하기 */}
        <TouchableOpacity onPress={resetRankings}>
          <Text style={styles.footerButton}>초기화</Text>
        </TouchableOpacity>
        {/* 게임 다시 시작하기 */}
        <TouchableOpacity onPress={() => {
            setIsNotRegistered(true);
            setPlayerName('');
            navigation.navigate('Home');
          }}>
          <Text style={styles.footerButton}>다시하기</Text>
        </TouchableOpacity>
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
    flex: 1.2,
    alignItems: 'center',
    marginTop: '30%',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: 'ivory',
  },
  score: {
    fontSize: 50,
    fontWeight: '600',
    color: 'ivory',
    marginTop: 10,
  },
  inputContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    color: 'ivory',
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: '60%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'ivory',
    color: 'ivory',
    marginBottom: 10,
  },
  saveButton: {
    fontSize: 20,
    color: 'ivory',
    backgroundColor: '#444',
    padding: 10,
  },
  rankingsContainer: {
    flex: 1.5,
    alignItems: 'center',
  },
  rankingItem: {
    marginVertical: 5,
  },
  rankingText: {
    color: 'ivory',
    fontSize: 20,
    fontWeight: '600',
  },
  footer: {
    flex: 1.3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerButton: {
    fontSize: 40,
    fontWeight: '400',
    color: 'ivory',
    textAlign: 'center',
    marginHorizontal: '13%',
    marginTop: '10%',
  },
});

export default ResultScreen;