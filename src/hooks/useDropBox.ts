import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { differenceBy, isEqual, noop } from 'lodash';

import { BoxInfo, useDropHandlers } from './useDropHandlers';
import { getMouseInfo, getToIdx } from './utils';
import {
  DraggableHandle, DndItem, ItemId,
  ItemWithId, UseDropBoxProps
} from '../types';
import style from './drag.module.css';

export default function useDropBox({
  accept,
  canDragInOut = false,
  // fixedItemIds,
  items: defaultItems,
  moving,
  onDragEnd = noop,
  onDragEnter = noop,
  onDragLeave = noop,
  onDragStart = noop,
  onDrop,
}: UseDropBoxProps) {
  const [items, setItems] = useState<ItemWithId[]>(structuredClone(defaultItems));
  const boxInfoRef = useRef({}) as MutableRefObject<BoxInfo>;
  const boxRef = useRef<HTMLElement>(null);
  const draggablesRef = useRef<DraggableHandle[]>([]);
  const draggingInOutRef = useRef(false);
  const toIdRef = useRef<ItemId>(null) as MutableRefObject<ItemId>;
  const prevItemsRef = useRef<ItemWithId[]>(items);

  const dragDropManager = useDragDropManager();

  const setItemsAndPrev = (newItems: ItemWithId[]) => {
    prevItemsRef.current = items;
    setItems(newItems);
  }

  // setTimeout() to execute after draggablesRef is updated
  const removeNullsFromDraggablesRef = (onAfterRemove = noop) => setTimeout(() => {
    // Clean up draggablesRef
    draggablesRef.current = draggablesRef.current.filter(dr => dr !== null);
    onAfterRemove();
  });

  useEffect(() => {
    if (!isEqual(defaultItems, items)) {
      // console.log('useEffect defaultItems', items);
      setItemsAndPrev(defaultItems);
      removeNullsFromDraggablesRef();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultItems)]);

  useEffect(() => {
    draggingInOutRef.current = false;
    // console.log('useEffect items', prevItemsRef.current, items);

    removeNullsFromDraggablesRef(() => {
      if (items.length > prevItemsRef.current.length) {
        const dndItm = dragDropManager.getMonitor().getItem();
        const res = differenceBy(items, prevItemsRef.current, 'id');
        const idx = items.findIndex((it) => isEqual(it, res[0]));
        console.log('diff', res, idx);
        dndItm.index = idx;
        draggablesRef.current[idx]?.getDOMElement()
          .classList.add(style.dragging);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  const moveItem = (from: number, to: number) => {
    const itemFrom = items[from];
    setItemsAndPrev(items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept,

    drop: (dndItm: DndItem) => {
      // console.log('drop', items);

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
    },

    hover: (dndItm: DndItem, monitor) => {
      // console.log('hover?', moving, draggingInOutRef.current, dndItm.currentBoxEl, boxRef.current);
      
      if (!moving && !draggingInOutRef.current && dndItm.currentBoxEl === boxRef.current) {
        const draggables = draggablesRef.current;
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
    },
  });

  const {
    _onDragStart,
    _onDragEnter,
    _onDragLeave,
    _onDragEnd,
  } = useDropHandlers({
    accept,
    boxInfoRef,
    canDragInOut,
    draggingInOutRef,
    items,
    setItemsAndPrev,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragStart,
  });

  drop(boxRef);

  return {
    draggablesRef,
    droppableRef: boxRef,
    items,
    droppableProps: {
      onDragEnd: _onDragEnd,
      onDragEnter: _onDragEnter,
      onDragLeave: _onDragLeave,
      onDragStart: _onDragStart,
    }
  };
}