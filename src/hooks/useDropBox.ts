import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { differenceBy, isEqual, noop } from 'lodash';

import * as handlers from './dropHandlers';

import { BoxInfo, useDropHandlers } from './useDropHandlers';
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
  onDrop = noop,
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

  const initNewDragItem = () => {
    if (items.length > prevItemsRef.current.length) {
      const dndItm = dragDropManager.getMonitor().getItem();
      const res = differenceBy(items, prevItemsRef.current, 'id');
      const idx = items.findIndex((it) => isEqual(it, res[0]));
      dndItm.index = idx;
      draggablesRef.current[idx]?.getDOMElement()
        .classList.add(style.dragging);
    }
  }

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

  const moveItem = (from: number, to: number) => {
    const itemFrom = items[from];
    setItemsAndPrev(items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept,

    drop: (dndItm: DndItem) => {
      handlers.onDrop({
        defaultItems,
        dndItm,
        draggablesRef,
        items,
        toIdRef,
        onDrop,
      })
    },

    hover: (dndItm: DndItem, monitor) => {
      handlers.onHover({
        boxRef,
        dndItm,
        draggablesRef,
        draggingInOutRef,
        monitor,
        moveItem,
        moving,
        toIdRef,
      })
    },
  });

  drop(boxRef);

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
    removeNullsFromDraggablesRef(initNewDragItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

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