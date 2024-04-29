import { XYCoord } from 'react-dnd';
import { getWidth } from 'mezr/getWidth';
import { DraggableImpHandle, MouseInfo } from '../types';

export const getDragSrcEl = (el: HTMLElement | null): HTMLElement | null =>
  el === null ? null : el.closest('.__flow-dnd-drag-item') as HTMLElement;

function getMouseLocInfo(
  targetEl: HTMLElement | null = null,
  boxWidth: number,
  offset: XYCoord | null,
): MouseInfo {
  if (targetEl === null || offset === null) return {};
  const itemRect = targetEl.getBoundingClientRect();
  
  if (offset.y >= itemRect.top && offset.y <= itemRect.bottom) {
    if (offset.x >= itemRect.right) {
      return {
        dist: offset.x - itemRect.right,
        isInside: false,
        sideToGo: 'right',
      };
    } else if (offset.x >= itemRect.left) {
      return {
        isInside: true,
        // If el is as wide as the box
        sideToGo: getWidth(targetEl, 'margin') >= boxWidth ?
          // Compare vertically
          (offset.y > ((itemRect.top + itemRect.bottom) / 2) ? 'right' : 'left') :
          // Compare horizontally
          offset.x > ((itemRect.right + itemRect.left) / 2) ? 'right' : 'left',
      };
    }

    return {
      dist: itemRect.left - offset.x,
      isInside: false,
      sideToGo: 'left',
    };
  }
  return {};
}

export function getMouseInfo(
  // Draggables are also drop targets
  draggableImps: DraggableImpHandle[],
  boxEl: HTMLElement,
  clientOffset: XYCoord | null
) {
  let info = { dist: Number.POSITIVE_INFINITY } as MouseInfo;
  const boxWidth = getWidth(boxEl, 'content');

  if (draggableImps.length) {
    for (let i = 0; i < draggableImps.length; i++) {
      const loc = getMouseLocInfo(
        draggableImps[i].getDOMElement(),
        boxWidth,
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

export const getToIdx = (itemIdx: number, hoverIdx: number, sideToGo: string) =>
  itemIdx < hoverIdx ?
    (sideToGo === 'right' ? hoverIdx : hoverIdx - 1) :
    (sideToGo === 'right' ? hoverIdx + 1 : hoverIdx);

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