// Constants.js
import { Dimensions } from 'react-native';

const Constants = {
  // Screen dimensions
  MAX_WIDTH: Dimensions.get('window').width,
  MAX_HEIGHT: Dimensions.get('window').height,
  // Size of each grid cell (in pixels)
  CELL_SIZE: 20,
  // Number of cells that fit in the screen width and height
  GRID_WIDTH: Math.floor(Dimensions.get('window').width / 20),
  GRID_HEIGHT: Math.floor(Dimensions.get('window').height / 20)
};

export default Constants;
