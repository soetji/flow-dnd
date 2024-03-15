import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import { getMouseInfo, getToIdx } from './utils';
import {
  DraggableHandle, DndItem, ItemId,
  ItemWithId, UseDropBoxProps
} from '../types';
import style from './drag.module.css';

interface BoxInfo {
  boxEl?: HTMLElement,
  dragEl?: HTMLElement,
  dropBoxEl?: HTMLElement,
  itemId?: ItemId,
  itemLeaveIndex?: number,
}

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
  const draggingInOut = useRef(false);
  const toIdRef = useRef<ItemId>(null) as MutableRefObject<ItemId>;
  const dragDropManager = useDragDropManager();

  useEffect(() => {
    if (!isEqual(defaultItems, items)) {
      setItems(defaultItems);
      // setTimeout() to execute after draggablesRef is updated
      setTimeout(() =>
        // Clean up draggablesRef
        draggablesRef.current = draggablesRef.current.filter(dr => dr !== null)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultItems)]);

  useEffect(() => {
    draggingInOut.current = false;
    // setTimeout() to execute after draggablesRef is updated
    setTimeout(() =>
      // Clean up draggablesRef
      draggablesRef.current = draggablesRef.current.filter(dr => dr !== null)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  const moveItem = (from: number, to: number) => {
    const itemFrom = items[from];
    setItems(items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept,

    drop: (dndItm: DndItem) => {
      // console.log('drop', items);

      draggablesRef.current[dndItm.index].getDOMElement()
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
      // console.log('hover?', moving, draggingInOut.current, dndItm.currentBoxEl, boxRef.current);
      
      if (!moving && !draggingInOut.current && dndItm.currentBoxEl === boxRef.current) {
        // console.log('hover');
        const draggables = draggablesRef.current;
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

  // Drag event handlers

  const setStartBoxInfo = (info: object) =>
    boxInfoRef.current = { ...boxInfoRef.current, ...info };

  const _onDragStart = (ev: DragEvent) => {
    const boxEl = ev.currentTarget;
    boxInfoRef.current = {
      boxEl,
      dragEl: ev.target,
      dropBoxEl: boxEl,
    } as BoxInfo;
    onDragStart();
    
    setTimeout(() => {
      const dndItm = dragDropManager.getMonitor().getItem();
      dndItm.currentBoxEl = boxEl;
      dndItm.itemToCopy = items[dndItm.index];
      dndItm.setStartBoxInfo = setStartBoxInfo;
      dndItm.startBoxEl = boxEl;

      boxInfoRef.current = {
        ...boxInfoRef.current,
        itemId: dndItm.id,
        itemLeaveIndex: dndItm.index,
      } as BoxInfo;
    });
  };

  const _onDragEnter = (ev: DragEvent) => {
    if (canDragInOut) {
      ev.preventDefault();
      const dndItm = dragDropManager.getMonitor().getItem();
      // console.log('_onDragEnter?', items, ev.currentTarget, ev.target, ev.relatedTarget);
  
      if (dndItm.type === accept &&
        (ev.currentTarget as HTMLElement).contains(ev.target as HTMLElement) &&
        ev.relatedTarget !== null && // Why is it null in the beginning of drag?
        // Cannot enter from anything element inside the box
        ev.currentTarget !== ev.relatedTarget &&
        !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
      ) {
        // console.log('_onDragEnter', items, ev.currentTarget, ev.target, ev.relatedTarget);
        dndItm.setStartBoxInfo({ dropBoxEl: ev.currentTarget });
  
        if (boxInfoRef.current.dragEl) {
          boxInfoRef.current.dragEl.classList.remove(style.hidden);
          dndItm.index = boxInfoRef.current.itemLeaveIndex;
          // addToEndInfo(dndItm.id, items, endInfoRef.current);
        } else {
          const newItem = dndItm.itemToCopy as ItemWithId;
          const newItems = [...items, newItem];
          // addToEndInfo(dndItm.id, newItems, endInfoRef.current);
          draggingInOut.current = true;
          setItems(newItems);
          dndItm.index = newItems.length - 1;
          dndItm.currentBoxEl = ev.currentTarget;
          onDragEnter(newItem, newItems);
          
          // Wait for the next render cycle after the new item is mounted
          setTimeout(() => {
            draggablesRef.current[dndItm.index]?.getDOMElement()
              .classList.add(style.dragging);
          });
        }
      }
    } else {
      onDragEnter();
    }
  }

  const _onDragLeave = (ev: DragEvent) => {
    if (canDragInOut) {
      const dndItm = dragDropManager.getMonitor().getItem();
      // console.log('_onDragLeave?', items, ev.currentTarget, ev.target, ev.relatedTarget);
      
      if (dndItm.type === accept &&
        (ev.currentTarget as HTMLElement).contains(ev.target as HTMLElement) &&
        // Cannot leave to anything element inside the box
        ev.currentTarget !== ev.relatedTarget &&
        !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
      ) {
        // console.log('_onDragLeave', items, ev.currentTarget, ev.target, ev.relatedTarget);
        dndItm.setStartBoxInfo({ dropBoxEl: dndItm.startBoxEl });
        
        if (boxInfoRef.current.dragEl) {
          boxInfoRef.current.dragEl.classList.add(style.hidden);
          dndItm.setStartBoxInfo = setStartBoxInfo;
          boxInfoRef.current.itemLeaveIndex = dndItm.index;
        } else {
          const newItems = items.toSpliced(dndItm.index, 1);
          draggingInOut.current = true;
          // removeFromEndInfo(dndItm.id, newItems, endInfoRef.current);
          setItems(newItems);
          onDragLeave(dndItm.id, newItems);
        }
      }
    } else {
      onDragLeave();
    }
  };

  const _onDragEnd = (ev: DragEvent) => {
    // dragDropManager returns null here
    // ev.target is the original drag el
    // ev.currentTarget is the original box
    // console.log('_onDragEnd', items, boxInfoRef.current.dropBoxEl, ev.currentTarget);
    if (boxInfoRef.current.dropBoxEl === ev.currentTarget) {
      // No need for this. Why?
      // boxInfoRef.current.dragEl?.classList.remove(style.hidden);
      onDragEnd(null, items);
    } else {
      const newItems = items.toSpliced(boxInfoRef.current.itemLeaveIndex as number, 1);
      // removeFromEndInfo(boxInfoRef.current.itemId as ItemId, newItems, endInfoRef.current);
      setItems(newItems);
      onDragEnd(boxInfoRef.current.itemId, newItems);
    }
    boxInfoRef.current = {};
  };

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