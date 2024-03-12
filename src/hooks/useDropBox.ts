import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import { getMouseLocInfo } from '../utils/utils';
import { DraggableHandle, DndItem, ItemId,
  ItemWithId, MouseInfo, UseDropBoxProps } from '../types';

export default function useDropBox({
  accept,
  canDragInOut = false,
  // fixedItemIds,
  items: defaultItems,
  moving,
  onDragEnd = noop,
  onDragOut = noop,
  onDragIn = noop,
  onDragStart = noop,
  onDrop,
}: UseDropBoxProps) {
  const [items, setItems] = useState<ItemWithId[]>(structuredClone(defaultItems));
  const [dragItem, setDragItem] = useState<ItemWithId | null>(null);
  const draggingInOut = useRef(false);
  const draggablesRef = useRef<DraggableHandle[]>([]);
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
      // console.log('drop');
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
      if (!moving && !draggingInOut.current) {
        const clientOffset = monitor.getClientOffset();
        const draggables = draggablesRef.current;
        let mLoc = { dist: Number.POSITIVE_INFINITY } as MouseInfo;
  
        if (draggables.length) {
          for (let i = 0; i < draggables.length; i++) {
            const loc = getMouseLocInfo(
              draggables[i].getDOMElement()?.getBoundingClientRect(),
              clientOffset
            );
  
            if (loc.isInside) {
              mLoc = { ...loc, hoverIdx: i };
              break;
            }
  
            if (loc.dist && mLoc.dist && loc.dist < mLoc.dist) {
              mLoc = { ...loc, hoverIdx: i };
            }
          }
        }
  
        if (mLoc.hoverIdx !== undefined && dndItm.index !== mLoc.hoverIdx) {
          // console.log('hover from', dndItm.index, 'to', mLoc.hoverIdx);
          const toIdx = dndItm.index < mLoc.hoverIdx ?
            (mLoc.side === 'right' ? mLoc.hoverIdx : mLoc.hoverIdx - 1) :
            (mLoc.side === 'right' ? mLoc.hoverIdx + 1 : mLoc.hoverIdx);
  
          if (dndItm.index !== toIdx) {
            toIdRef.current = draggables[toIdx].getId();
            moveItem(dndItm.index, toIdx);
            dndItm.index = toIdx;
          }
        }
      }
    },
  });

  const _onDragStart = () => {
    onDragStart();
    setTimeout(() => {
      const dndItm = dragDropManager.getMonitor().getItem();
      console.log('_onDragStart', items[dndItm.index])
      dndItm.itemToDragIn = items[dndItm.index];
    });
  }

  const _onDragEnd = () => {
    console.log('_onDragEnd')
    onDragEnd();
  }

  const onDragEnter= canDragInOut ? (ev: DragEvent) => {
    const dndItm = dragDropManager.getMonitor().getItem();
    
    if (dndItm.type === accept &&
      ev.target === ev.currentTarget &&
      // Not to items inside the box
      ev.currentTarget &&
      !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
    ) {
      const newItem = dndItm.itemToDragIn as ItemWithId;
      const newItems = [...items, newItem ];
      setItems(newItems);
      dndItm.index = newItems.length - 1;
      draggingInOut.current = true;
      onDragIn(newItem, newItems);
    }
  } : noop;

  const onDragLeave = canDragInOut ? (ev: DragEvent) => {
    const dndItm = dragDropManager.getMonitor().getItem();
    if (dndItm.type === accept &&
      ev.target === ev.currentTarget &&
      // Not to items inside the box
      ev.currentTarget &&
      !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
    ) {
      const newItems = items.toSpliced(dndItm.index, 1);
      setItems(newItems);
      draggingInOut.current = true;
      onDragOut(dndItm.id, newItems);
    }
  } : noop;

  return {
    draggablesRef,
    drop,
    items,
    droppableProps: {
      onDragEnd: _onDragEnd,
      onDragEnter,
      onDragLeave,
      onDragStart: _onDragStart
    }
  };
}