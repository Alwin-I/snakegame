import React from 'react';
import { View, Image } from 'react-native';

// Renders snake's head with direction-based sprite
export const Head = ({ position, size, xspeed, yspeed }) => {
  const x = position[0];
  const y = position[1];
  
  // use head based on direction of movement.
  let headImage;
  if (xspeed === 1) headImage = require('../assets/head/head_right.png');
  if (xspeed === -1) headImage = require('../assets/head/head_left.png');
  if (yspeed === 1) headImage = require('../assets/head/head_down.png');
  if (yspeed === -1) headImage = require('../assets/head/head_up.png');

  return (
    <View style={{
      position: 'absolute',
      width: size,
      height: size,
      left: x * size, // Position based on grid coordinates
      top: y * size
    }}>
      <Image
        source={headImage}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain'
        }}
      />
    </View>
  );
};
