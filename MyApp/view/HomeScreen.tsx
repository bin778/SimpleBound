import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

type HomeScreenProps = {
  navigation: StackNavigationProp<any, any>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Hello HaHa!! This is the Home Screen</Text>
      <Button title="Go to Game" onPress={() => navigation.navigate('Game')} />
      <Button title="Go to Result" onPress={() => navigation.navigate('Result')} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
