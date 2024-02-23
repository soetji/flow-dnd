import { XYCoord } from 'react-dnd';
import { MouseInfo } from './types';

export function getMouseLocInfo(
  itemRect: DOMRect | null = null,
  offset: XYCoord | null,
): MouseInfo {
  if (itemRect === null || offset === null) return {};

  if (offset.y >= itemRect.top && offset.y <= itemRect.bottom) {
    if (offset.x >= itemRect.right) {
      return {
        isInside: false,
        side: 'right',
        dist: offset.x - itemRect.right,
      };
    } else if (offset.x >= itemRect.left) {
      const rectMidX = (itemRect.right + itemRect.left) / 2;

      return {
        isInside: true,
        side: offset.x > rectMidX ? 'right' : 'left',
      };
    }

    return {
      isInside: false,
      side: 'left',
      dist: itemRect.left - offset.x,
    };
  }
  return {};
}