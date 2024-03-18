import { MutableRefObject, Ref } from 'react';
import { isEqual } from 'lodash';

import {
  DraggableHandle, DndItem, ItemId, ItemWithId,
  OnDropInfo
} from '../types';
import { getMouseInfo, getToIdx } from './utils';

import style from './drag.module.css';

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
  // console.log('onDrop', items);
  const idx = items.findIndex(it => it.id === dndItm.id);
  draggablesRef.current[idx].getDOMElement()
    .classList.remove(style.dragging);

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
  boxRef: Ref<HTMLElement>,
  dndItm: DndItem,
  draggablesRef: Ref<DraggableHandle[]>,
  draggingInOutRef: MutableRefObject<boolean>,
  monitor: unknown,
  moveItem: (from: number, to: number) => void,
  moving: boolean,
  toIdRef: MutableRefObject<ItemId>,
}

export function onHover({
  boxRef,
  dndItm,
  draggablesRef,
  draggingInOutRef,
  monitor,
  moveItem,
  moving,
  toIdRef,
}: OnHoverProps) {

  // console.log('hover?', moving, draggingInOutRef.current, dndItm.currentBoxEl, boxRef.current);
  
  if (!moving && !draggingInOutRef.current && dndItm.currentBoxEl === boxRef?.current) {
    const draggables = draggablesRef?.current;
    // console.log('hover', draggables);
    const mInfo = getMouseInfo(draggables, monitor.getClientOffset());

    if (mInfo.hoverIdx !== undefined && dndItm.index !== mInfo.hoverIdx) {
      // console.log('hover from', dndItm.index, 'to', mInfo.hoverIdx);
      const toIdx = getToIdx(dndItm.index, mInfo.hoverIdx, mInfo.side as string);

      if (dndItm.index !== toIdx) {
        toIdRef.current = draggables[toIdx].getId();
        // console.log('moveItem', items, dndItm.index, toIdx);
        moveItem(dndItm.index, toIdx);
        dndItm.index = toIdx;
      }
    }
  }
}