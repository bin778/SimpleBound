import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { colors } from './colors';
import { mapMatrix } from './MapMatrix';

interface ControlKeyProps {
  playerPosition: { row: number; col: number };
  setPlayerPosition: React.Dispatch<React.SetStateAction<{ row: number; col: number }>>;
}

const ControlKey: React.FC<ControlKeyProps> = ({ playerPosition, setPlayerPosition }) => {
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

  return (
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
  )
}

const styles = StyleSheet.create({
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

export default ControlKey