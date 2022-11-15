import { SPRITE_PIVOT_X, SPRITE_PIVOT_Y, SPRITE_PIVOT_OFFSET_Y_IN_PIXELS } from '../constants';
import { clamp } from './math.util';

import type { Vector2 } from '../interface';

export function getPivot(width: number, height: number, offset: Vector2): Vector2 {
  return {
    x: clamp(SPRITE_PIVOT_X * width + (offset.x ?? 0), 0, width),
    y: clamp(SPRITE_PIVOT_Y * height + SPRITE_PIVOT_OFFSET_Y_IN_PIXELS + (offset.y ?? 0), 0, height)
  };
}
