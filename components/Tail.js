import React from 'react';
import { View, Image } from 'react-native';
import Constants from '../Constants';

// Renders the snake's tail with appropriate sprites for each segment
export const Tail = ({ elements, size }) => {
  if (!elements || elements.length === 0) {
    return null;
  }

// Create tail segments based on position
  const tailSegments = elements.map((segment, index) => {
    const x = segment[0];
    const y = segment[1];
    
// Get adjacent positions to know segment type
    const prevPosition = index > 0 ? elements[index - 1] : null;
    const nextPosition = index < elements.length - 1 ? elements[index + 1] : null;
    
    let segmentImage;
    
    if (prevPosition && nextPosition) {
// Middle segments sprite for straight or corner
      if (prevPosition[0] === nextPosition[0]) {
        segmentImage = require('../assets/body/body_vertical.png');
      } else if (prevPosition[1] === nextPosition[1]) {
        segmentImage = require('../assets/body/body_horizontal.png');
      } else {

// Corner segment that is based on the previous and last segment position
        if ((prevPosition[0] < x && nextPosition[1] < y) || 
            (prevPosition[1] < y && nextPosition[0] < x)) {
          segmentImage = require('../assets/corner/body_tl.png');
        } else if ((prevPosition[0] > x && nextPosition[1] < y) || 
                   (prevPosition[1] < y && nextPosition[0] > x)) {
          segmentImage = require('../assets/corner/body_tr.png');
        } else if ((prevPosition[0] < x && nextPosition[1] > y) || 
                   (prevPosition[1] > y && nextPosition[0] < x)) {
          segmentImage = require('../assets/corner/body_bl.png');
        } else {
          segmentImage = require('../assets/corner/body_br.png');
        }
      }
    } else if (nextPosition) {
// First segment after head
      if (nextPosition[0] < x) {
        segmentImage = require('../assets/body/body_horizontal.png');
      } else if (nextPosition[0] > x) {
        segmentImage = require('../assets/body/body_horizontal.png');
      } else if (nextPosition[1] < y) {
        segmentImage = require('../assets/body/body_vertical.png');
      } else {
        segmentImage = require('../assets/body/body_vertical.png');
      }
    } else if (prevPosition) {
// Last segment /tail
      if (prevPosition[0] < x) {
        segmentImage = require('../assets/tail/tail_right.png');
      } else if (prevPosition[0] > x) {
        segmentImage = require('../assets/tail/tail_left.png');
      } else if (prevPosition[1] < y) {
        segmentImage = require('../assets/tail/tail_down.png');
      } else {
        segmentImage = require('../assets/tail/tail_up.png');
      }
    } else {
// Single segment case
      segmentImage = require('../assets/body/body_horizontal.png');
    }

    return (
      <View key={index} style={{
        position: 'absolute',
        width: size,
        height: size,
        left: x * size,
        top: y * size
      }}>
        <Image
          source={segmentImage}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain'
          }}
        />
      </View>
    );
  });

  // Container for all tail segments
  return (
    <View style={{ 
      position: 'absolute',
      width: Constants.GRID_WIDTH * size,
      height: Constants.GRID_HEIGHT * size 
    }}>
      {tailSegments}
    </View>
  );
};
