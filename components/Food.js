import React from 'react';
import { View, Image } from 'react-native';

// Renders apple at specified grid position
export const Food = ({ position, size }) => {
  const x = position[0];
  const y = position[1];
  return (
    <View style={{
      position: 'absolute',
      width: size,
      height: size,
      left: x * size, // Position based on grid coordinates
      top: y * size
    }}>
      <Image
        source={require('../assets/apple.png')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain'
        }}
      />
    </View>
  );
};
