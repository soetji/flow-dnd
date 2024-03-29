import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import * as handlers from './dropHandlers';

import { useDropHandlers } from './useDropHandlers';
import {
  BoxInfo, DraggableHandle, DndItem, ItemId,
  ItemWithId, UseDropBoxProps
} from '../types';
import style from './drag.module.css';

// const getIds = (items: ItemWithId[]) => items.map(it => it.id);

export default function useDropBox({
  accept,
  canDragInOut = false,
  canDrop = true,
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
  const [showOrigDragEl, setShowOrigDragEl] = useState(true);
  const boxInfoRef = useRef({}) as MutableRefObject<BoxInfo>;
  const boxRef = useRef<HTMLElement>(null);
  const canHover = useRef(false); // True to prevent hover triggers
  const draggablesRef = useRef<DraggableHandle[]>([]);
  const toIdRef = useRef<ItemId>(null) as MutableRefObject<ItemId>;
  const prevItemsRef = useRef<ItemWithId[]>(items);

  const dragDropManager = useDragDropManager();

  // Refilled after render
  draggablesRef.current = [];

  const setItemsAndPrev = (newItems: ItemWithId[]) => {
    prevItemsRef.current = items;
    setItems(newItems);
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
    canHover,
    items,
    setItemsAndPrev,
    setShowOrigDragEl,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragStart,
  });

  const moveItem = (from: number, to: number) => {
    // console.log('moveItem', from, to, items);
    const itemFrom = items[from];
    setItemsAndPrev(items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept,
    canDrop: () => canDrop,

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
        canHover,
        monitor,
        moveItem,
        moving,
        toIdRef,
      })
    },
  });

  drop(boxRef);

  // console.log('current', getIds(items), getIds(defaultItems));

  const initNewDragItem = () => {
    const dndItm = dragDropManager.getMonitor().getItem();
    if (dndItm !== null) {
      const idx = items.findIndex((it) => it.id === dndItm.id);
      // console.log('initNewDragItem', idx, dndItm.id, getIds(items));
      // If drag item not removed
      if (idx !== -1) {
        dndItm.index = idx;
        draggablesRef.current[idx]?.getDOMElement()
          .classList.add(style.dragging);
      }
    }
  }

  useEffect(() => {
    if (!isEqual(defaultItems, items)) {
      // console.log('useEffect defaultItems', getIds(items), getIds(defaultItems));
      setItemsAndPrev(defaultItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultItems)]);

  useEffect(() => {
    // console.log('useEffect items', getIds(prevItemsRef.current), getIds(items));
    initNewDragItem();
    // Restore hover after enter and leave events outside the orig drag box
    canHover.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  useEffect(() => {
    boxInfoRef.current.dragEl?.classList[showOrigDragEl ? 'remove' : 'add'](style.hidden);
    // Restore hover after enter and leave events in the orig drag box
    canHover.current = true;
  }, [showOrigDragEl]);

  return {
    draggablesRef,
    droppableRef: boxRef,
    items,
    droppableProps: canDrop ? {
      onDragEnd: _onDragEnd,
      onDragEnter: _onDragEnter,
      onDragLeave: _onDragLeave,
      onDragStart: _onDragStart,
    } : {}
  };
}