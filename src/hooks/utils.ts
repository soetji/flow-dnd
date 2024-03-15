import { XYCoord } from 'react-dnd';
import { DraggableHandle, MouseInfo } from '../types';

function getMouseLocInfo(
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

export function getMouseInfo(
  draggables: DraggableHandle[],
  clientOffset: XYCoord | null
) {
  let info = { dist: Number.POSITIVE_INFINITY } as MouseInfo;

  if (draggables.length) {
    for (let i = 0; i < draggables.length; i++) {
      const loc = getMouseLocInfo(
        draggables[i].getDOMElement()?.getBoundingClientRect(),
        clientOffset
      );

      if (loc.isInside) {
        info = { ...loc, hoverIdx: i };
        break;
      }

      if (loc.dist && info.dist && loc.dist < info.dist) {
        info = { ...loc, hoverIdx: i };
      }
    }
  }

  return info;
}

export const getToIdx = (itemIdx: number, hoverIdx: number, side: string) =>
  itemIdx < hoverIdx ?
    (side === 'right' ? hoverIdx : hoverIdx - 1) :
    (side === 'right' ? hoverIdx + 1 : hoverIdx);

// EndInfo
// export function addToEndInfo(id: ItemId, newItems: ItemWithId[], endInfo: EndInfo) {
//   const removedIds = endInfo.removedIds;
//   if (removedIds.includes(id)) {
//     removedIds.splice(removedIds.indexOf(id), 1);
//   } else {
//     endInfo.addedIds.push(id);
//   }
//   endInfo.items = newItems;
// }

// export function removeFromEndInfo(id: ItemId, newItems: ItemWithId[], endInfo: EndInfo) {
//   const addedIds = endInfo.addedIds;
//   if (addedIds.includes(id)) {
//     addedIds.splice(addedIds.indexOf(id), 1);
//   } else {
//     endInfo.removedIds.push(id);
//   }
//   endInfo.items = newItems;
// }