import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import {
  StartBoxInfo, ItemId,
  ItemWithId, UseDropBoxProps
} from '../types';

import useDrop from './useDrop';
import useDropBoxHandlers from './useDropBoxHandlers';
import styles from './styles.module.css';
// import { getIds } from '../utils';

export default function useDropBox({
  accept,
  canDragInOut = false,
  canDrop = true,
  draggableImpsRef,
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
  const startBoxInfoRef = useRef(null) as MutableRefObject<StartBoxInfo | null>;
  const boxRef = useRef<HTMLElement>(null);
  // const canHoverRef = useRef(false); // True to prevent hover triggers
  const toIdRef = useRef<ItemId>(null) as MutableRefObject<ItemId>;
  const prevItemsRef = useRef<ItemWithId[]>(items);

  const dragDropManager = useDragDropManager();

  const setItemsAndPrev = (newItems: ItemWithId[]) => {
    // console.log('setItemsAndPrev', getIds(newItems));
    prevItemsRef.current = items;
    setItems(newItems);
  }

  const {
    dragging,
    _onDragStart,
    _onDragEnter,
    _onDragLeave,
    _onDragEnd,
  } = useDropBoxHandlers({
    accept,
    canDragInOut,
    // canHoverRef,
    items,
    setItemsAndPrev,
    startBoxInfoRef,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragStart,
  });

  useDrop({
    accept,
    boxRef,
    canDrop,
    // canHoverRef,
    defaultItems,
    draggableImpsRef,
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
        const dragCurrEl = draggableImpsRef.current[idx]?.getDOMElement();
        dndItm.index = idx;
        dndItm.setStartBoxInfo({ dragCurrEl });
        dragCurrEl?.classList.add(styles.dragging);
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
    // canHoverRef.current = true;
    // console.log('items canHoverRef', true);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  return {
    dragging,
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