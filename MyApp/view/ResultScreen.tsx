import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';

interface RootStackParamList extends ParamListBase {
  Home: undefined;
}

interface ResultScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const { score } = route.params as { score: number };

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.header}>
        <Text style={styles.title}>Game Over</Text>
        <Text style={styles.title}>당신의 점수는?</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.score}>{score}점</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.reGame}>다시하기</Text>
        </TouchableOpacity>
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
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: '10%',
    marginTop: '10%',
  },
  title: {
    fontSize: 50,
    fontWeight: '600',
    color: 'ivory',
  },
  main: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: '10%',
  },
  score: {
    fontSize: 60,
    fontWeight: '600',
    color: 'ivory',
  },
  reGame: {
    fontSize: 30,
    fontWeight: '400',
    color: 'ivory',
    marginTop: '3%',
  }
});

export default ResultScreen;