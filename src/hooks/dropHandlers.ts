import { MutableRefObject, RefObject } from 'react';
import { DropTargetMonitor } from 'react-dnd';
import { isEqual } from 'lodash';

import {
  DraggableHandle, DndItem, ItemId, ItemWithId,
  OnDropInfo
} from '../types';
import { getMouseInfo, getToIdx } from './utils';

import style from './drag.module.css';
// const getIds = (items: ItemWithId[]) => items.map(it => it.id);

interface OnDropProps {
  defaultItems: ItemWithId[],
  dndItm: DndItem,
  draggablesRef: MutableRefObject<DraggableHandle[]>,
  items: ItemWithId[],
  toIdRef: MutableRefObject<ItemId>,
  onDrop: (info: OnDropInfo) => void,
}

export function onDrop({
  defaultItems,
  dndItm,
  draggablesRef,
  items,
  toIdRef,
  onDrop
}: OnDropProps) {
  // Delay until draggablesRef fill up
  setTimeout(() => {
    const idx = items.findIndex(it => it.id === dndItm.id);
    // console.log('onDrop', getIds(items), idx, draggablesRef.current);
    draggablesRef.current[idx] && draggablesRef.current[idx].getDOMElement()
      .classList.remove(style.dragging);
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
  draggablesRef: RefObject<DraggableHandle[]>,
  canHover: MutableRefObject<boolean>,
  monitor: DropTargetMonitor,
  moveItem: (from: number, to: number) => void,
  moving: boolean,
  toIdRef: MutableRefObject<ItemId>,
}

export function onHover({
  boxRef,
  dndItm,
  draggablesRef,
  canHover,
  monitor,
  moveItem,
  moving,
  toIdRef,
}: OnHoverProps) {

  // console.log('hover?', moving, canHover.current, dndItm.currentBoxEl, boxRef.current);
  
  if (!moving && canHover.current && dndItm.currentBoxEl === boxRef?.current) {
    const draggables = draggablesRef?.current as DraggableHandle[];
    // console.log('hover', moving, canHover.current, dndItm.currentBoxEl, boxRef.current, draggables);
    const mInfo = getMouseInfo(draggables, monitor.getClientOffset());

    if (mInfo.hoverIdx !== undefined && dndItm.index !== mInfo.hoverIdx) {
      // console.log('hover from', dndItm.index, 'to', mInfo.hoverIdx);
      const toIdx = getToIdx(dndItm.index, mInfo.hoverIdx, mInfo.side as string);

      if (dndItm.index !== toIdx) {
        toIdRef.current = draggables[toIdx].getId();
        moveItem(dndItm.index, toIdx);
        dndItm.index = toIdx;
      }
    }
  }
}