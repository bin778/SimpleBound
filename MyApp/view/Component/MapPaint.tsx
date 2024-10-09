import React from "react";
import { View, Image, StyleSheet } from 'react-native';

interface MapPaintProps {
  mapMatrix: number[][];
  playerPosition: { row: number, col: number };
  bombs: { row: number, col: number, explode: boolean, affectedTiles?: { row: number, col: number }[] }[];
}

const MapPaint: React.FC<MapPaintProps> = ({ mapMatrix, playerPosition, bombs }) => {
  return (
    <View style={styles.map}>
      {mapMatrix.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((tile, colIndex) => {
            const isPlayer = rowIndex === playerPosition.row && colIndex === playerPosition.col;
            const isBomb = bombs.find(bomb => bomb.row === rowIndex && bomb.col === colIndex);
            const isExplosion = bombs.some(bomb => bomb.explode && bomb.affectedTiles?.some(tile => tile.row === rowIndex && tile.col === colIndex));

            if (isPlayer) {
              return <Image key={colIndex} source={require('../../image/player.webp')} style={styles.tile} />;
            }

            if (isExplosion) {
              return <Image key={colIndex} source={require('../../image/explosion.webp')} style={styles.tile} />;
            }

            if (isBomb && !isExplosion) {
              return <Image key={colIndex} source={require('../../image/bomb.webp')} style={styles.tile} />;
            }

            return (
              <Image
                key={colIndex}
                source={tile === 1 ? require('../../image/wall.webp') : require('../../image/land.webp')}
                style={styles.tile}
              />
            );
          })}
        </View>
      ))}
    </View>
  )
};

const styles = StyleSheet.create({
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
});

export default MapPaint;
