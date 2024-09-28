import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ParamListBase } from '@react-navigation/native';
import { colors } from "./colors";

// Stack Navigator에서 사용할 Param 타입 정의
interface RootStackParamList extends ParamListBase {
  Game: undefined;
}

// navigation 타입 지정
interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Game'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>SIMPLE</Text>
        <Text style={styles.title}>BOUND</Text>
      </View>
      <View style={styles.main}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game')}>
          <Text style={styles.buttonText}>게임 시작</Text>
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
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: '600',
    color: 'ivory',
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;