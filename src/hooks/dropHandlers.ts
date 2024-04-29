import { MutableRefObject, RefObject } from 'react';
import { DropTargetMonitor } from 'react-dnd';
import { isEqual } from 'lodash';

import {
  DraggableImpHandle, DndItem, ItemId, ItemWithId,
  OnDropInfo
} from '../types';
import { getMouseInfo, getToIdx } from './utils';

import styles from './styles.module.css';
// const getIds = (items: ItemWithId[]) => items.map(it => it.id);

interface OnDropProps {
  defaultItems: ItemWithId[],
  dndItm: DndItem,
  draggableImpsRef: MutableRefObject<DraggableImpHandle[]>,
  items: ItemWithId[],
  toIdRef: MutableRefObject<ItemId>,
  onDrop: (info: OnDropInfo) => void,
}

export function onDrop({
  defaultItems,
  dndItm,
  draggableImpsRef,
  items,
  toIdRef,
  onDrop
}: OnDropProps) {
  // Delay until draggableImpsRef fill up
  setTimeout(() => {
    const idx = items.findIndex(it => it.id === dndItm.id);
    // console.log('onDrop', getIds(items), idx, draggableImpsRef.current);
    draggableImpsRef.current[idx] && draggableImpsRef.current[idx].getDOMElement()
      ?.classList.remove(styles.dragging);
  }, 500);

  if (onDrop && toIdRef.current !== null &&
    !isEqual(items, defaultItems)
  ) {
    onDrop({
      fromId: dndItm.id,
      fromItems: items,
      toId: toIdRef.current,
      toItems: items,
    });
  }
}

interface OnHoverProps {
  boxRef: RefObject<HTMLElement>,
  dndItm: DndItem,
  draggableImpsRef: RefObject<DraggableImpHandle[]>,
  canHoverRef: MutableRefObject<boolean>,
  monitor: DropTargetMonitor,
  moveItem: (from: number, to: number) => void,
  moving: boolean,
  toIdRef: MutableRefObject<ItemId>,
}

export function onHover({
  boxRef,
  dndItm,
  draggableImpsRef,
  canHoverRef,
  monitor,
  moveItem,
  moving,
  toIdRef,
}: OnHoverProps) {

  // console.log('hover?', moving, canHoverRef.current, dndItm.currentBoxEl, boxRef.current);
  
  if (!moving && canHoverRef.current && dndItm.currentBoxEl === boxRef?.current) {
    const draggableImps = draggableImpsRef?.current as DraggableImpHandle[];
    // console.log('draggableImps', draggableImps);
    
    const mInfo = getMouseInfo(draggableImps, boxRef?.current,
      monitor.getClientOffset());
    // console.log('hover', moving, canHoverRef.current, dndItm.currentBoxEl, boxRef.current, draggableImps, dndItm.index, mInfo);

    if (mInfo.hoverIdx !== undefined && dndItm.index !== mInfo.hoverIdx) {
      const toIdx = getToIdx(dndItm.index, mInfo.hoverIdx, mInfo.sideToGo as string);
      // console.log('hover from', dndItm.index, 'to', mInfo.hoverIdx, toIdx);

      if (dndItm.index !== toIdx) {
        toIdRef.current = draggableImps[toIdx].getId();
        moveItem(dndItm.index, toIdx);
        dndItm.index = toIdx;
      }
    }
  }
}