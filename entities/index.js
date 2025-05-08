import Constants from '../Constants';

// Handles snake movement based on swipe gesture
export const GameLoop = (entities, { touches }) => {
  const head = entities.head;

// Get touch start and end positions
  let startTouch = touches.find(t => t.type === 'start');
  let moveTouch = touches.find(t => t.type === 'end');

// Store initial touch position
  if (startTouch) {
    head.touchStart = [startTouch.event.pageX, startTouch.event.pageY];
  }

// Calculate movement direction based on swipe
  if (moveTouch && head.touchStart) {
    const dx = moveTouch.event.pageX - head.touchStart[0]; // Horizontal movement
    const dy = moveTouch.event.pageY - head.touchStart[1]; // Vertical movement
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 20) {
      if (absDx > absDy) {
        if (dx > 0 && head.xspeed !== -1) { // Swipe right
          head.xspeed = 1;
          head.yspeed = 0;
        } else if (dx < 0 && head.xspeed !== 1) { // Swipe left
          head.xspeed = -1;
          head.yspeed = 0;
        }
      } else {
        if (dy > 0 && head.yspeed !== -1) { // Swipe down
          head.xspeed = 0;
          head.yspeed = 1;
        } else if (dy < 0 && head.yspeed !== 1) { // Swipe up
          head.xspeed = 0;
          head.yspeed = -1;
        }
      }
    }

    head.touchStart = null; // Reset touch
  }

  return entities;
};
