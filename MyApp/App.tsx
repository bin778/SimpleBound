import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './view/HomeScreen';
import GameScreen from './view/GameScreen';
import ResultScreen from './view/ResultScreen';

// Tab Navigator 생성
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} options={{tabBarStyle: {display: 'none'}, headerShown: false }} />
        <Tab.Screen name="Game" component={GameScreen} options={{tabBarStyle: {display: 'none'}, headerShown: false }} />
        <Tab.Screen name="Result" component={ResultScreen} options={{headerShown: false}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
