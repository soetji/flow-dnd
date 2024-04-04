import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import {
  BoxInfo, DraggableHandle, ItemId,
  ItemWithId, UseDropBoxProps
} from '../types';

import useDrop from './useDrop';
import useDropBoxHandlers from './useDropBoxHandlers';
import styles from './styles.module.css';

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
  const [showDragPreviewSrcEl, setShowDragPreviewSrcEl] = useState(true);
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
    // console.log('setItemsAndPrev', getIds(newItems));
    prevItemsRef.current = items;
    setItems(newItems);
  }

  const {
    _onDragStart,
    _onDragEnter,
    _onDragLeave,
    _onDragEnd,
  } = useDropBoxHandlers({
    accept,
    boxInfoRef,
    canDragInOut,
    canHover,
    items,
    setItemsAndPrev,
    setShowDragPreviewSrcEl,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragStart,
  });

  useDrop({
    accept,
    boxRef,
    canDrop,
    canHover,
    defaultItems,
    draggablesRef,
    // fixedItemIds,
    items,
    moving,
    setItemsAndPrev,
    toIdRef,
    onDrop,
  })

  // console.log('current', getIds(items), getIds(defaultItems));

  const initNewDragItem = () => {
    const dndItm = dragDropManager.getMonitor().getItem();
    // console.log('initNewDragItem', dndItm);
    
    if (dndItm !== null) {
      const idx = items.findIndex((it) => it.id === dndItm.id);
      // console.log('initNewDragItem', idx, dndItm.id, getIds(items));
      // If drag item not removed
      if (idx !== -1) {
        dndItm.index = idx;
        draggablesRef.current[idx]?.getDOMElement()
          .classList.add(styles.dragging);
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
    boxInfoRef.current.dragPreviewSrcEl?.classList[showDragPreviewSrcEl ? 'remove' : 'add'](styles.hidden);
    // Restore hover after enter and leave events in the orig drag box
    canHover.current = true;
  }, [showDragPreviewSrcEl]);

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