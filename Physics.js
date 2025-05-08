import Matter from 'matter-js';
import Constants from './Constants';


// random food placement in the game grid
 
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

/**
Main physics system that handles snake movement, collisions, and game mechanics
 @param {Object} entities 
 @param {Object} param1 
 @returns {Object}
 */
export const Physics = (entities, { time, dispatch }) => {
  // prevents processing of fake ticks
  if (!time || !time.delta) return entities;

  // Extract entity references for cleaner code
  const { engine } = entities.physics;
  const head = entities.head;
  const tail = entities.tail;
  const food = entities.food;

  // Skip physics update if game is paused or entities aren't properly initialized
  if (!entities.physics || !entities.physics.running) {
    return entities;
  }

  // Update Matter.js physics engine with current time delta
  Matter.Engine.update(engine, time.delta);

  // Handle snake movement timing
  head.nextMove -= 1;
  // If it's not time for the next move, return without updates
  if (head.nextMove > 0) return entities;

  // Reset movement counter based on current game speed
  head.nextMove = head.updateFrequency;

  // Calculate next position of snake head based on current direction
  const nextX = head.position[0] + head.xspeed;
  const nextY = head.position[1] + head.yspeed;

  // Check for collision with game boundaries
  if (
    nextX < 0 || nextX >= Constants.GRID_WIDTH ||
    nextY < 0 || nextY >= Constants.GRID_HEIGHT
  ) {
    dispatch({ type: 'game-over' });
    return entities;
  }

  // Update snake tail positions
  const newTail = [[...head.position], ...tail.elements];
  if (nextX !== food.position[0] || nextY !== food.position[1]) {
    newTail.pop();
  }

  // Update entity positions
  tail.elements = newTail;
  head.position[0] = nextX;
  head.position[1] = nextY;

  // Check for collision with snake's own tail
  if (tail.elements.some(([tx, ty]) => tx === nextX && ty === nextY)) {
    dispatch({ type: 'game-over' });
    return entities;
  }

  // Handle food collision and snake growth
  if (nextX === food.position[0] && nextY === food.position[1]) {
    // Increment score when food is eaten
    dispatch({ type: 'score+' });

    // Generate new food position
    let newFoodX, newFoodY;
    do {
      newFoodX = randomBetween(1, Constants.GRID_WIDTH - 2);
      newFoodY = randomBetween(1, Constants.GRID_HEIGHT - 2);
    } while (
      // Ensure food doesn't spawn on snake head or tail
      (newFoodX === nextX && newFoodY === nextY) ||
      tail.elements.some(([tx, ty]) => tx === newFoodX && ty === newFoodY)
    );

    // Update food position
    food.position[0] = newFoodX;
    food.position[1] = newFoodY;

    // Increase game speed by reducing update frequency
    if (head.updateFrequency > 2) head.updateFrequency -= 1;
  }

  return entities;
};
