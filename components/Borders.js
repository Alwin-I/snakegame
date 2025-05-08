import React from 'react';
import { View } from 'react-native';
import Constants from '../Constants';

// Creates game boundaries (dark green borders)
export const Borders = () => {
  const borderWidth = 4; // Width of border lines
  const borderColor = '#006400'; // Dark green color
  
  return (
    <View style={{
      position: 'absolute',
      width: Constants.GRID_WIDTH * Constants.CELL_SIZE, // Game area width
      height: Constants.GRID_HEIGHT * Constants.CELL_SIZE, // Game area height
      borderWidth: borderWidth,
      borderColor: borderColor,
    }}>
      {/* Top border */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: borderWidth,
        backgroundColor: borderColor,
      }} />
      {/* Bottom border */}
      <View style={{
        position: 'absolute',
        bottom: borderWidth,
        left: 0,
        right: 0,
        height: borderWidth,
        backgroundColor: borderColor,
      }} />
      {/* Left border */}
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: borderWidth,
        backgroundColor: borderColor,
      }} />
      {/* Right border */}
      <View style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: borderWidth,
        backgroundColor: borderColor,
      }} />
    </View>
  );
}; 