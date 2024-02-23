interface Offset {
  x: number;
  y: number;
}

export interface MouseInfo {
  isInside?: boolean,
  dist?: number;
  hoverIdx?: number;
  side?: string;
}

export function getMouseLocInfo(
  itemRect: DOMRect | null = null,
  { x, y }: Offset
): MouseInfo {
  if (itemRect === null) return {};

  if (y >= itemRect.top && y <= itemRect.bottom) {
    if (x >= itemRect.right) {
      return {
        isInside: false,
        side: 'right',
        dist: x - itemRect.right,
      };
    } else if (x >= itemRect.left) {
      const rectMidX = (itemRect.right + itemRect.left) / 2;

      return {
        isInside: true,
        side: x > rectMidX ? 'right' : 'left',
      };
    }

    return {
      isInside: false,
      side: 'left',
      dist: itemRect.left - x,
    };
  }
  return {};
}