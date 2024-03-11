import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import { getMouseLocInfo } from '../utils/utils';
import { DraggableHandle, DragItem, ItemId,
  MouseInfo, UseDropBoxProps } from '../types';

export default function useDropBox({
  accept,
  canDropInOut = false,
  // fixedItemIds,
  items: defaultItems,
  moving,
  onDrop,
  onDropIn = noop,
  onDropOut = noop,
}: UseDropBoxProps) {
  const [items, setItems] = useState(structuredClone(defaultItems));
  const droppingInOut = useRef(false);
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
    droppingInOut.current = false;
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

    drop: (item: DragItem) => {
      // console.log('drop');
      if (onDrop && toIdRef.current !== null &&
        !isEqual(items, defaultItems)
      ) {
        onDrop({
          fromId: item.id,
          fromItems: items,
          toId: toIdRef.current,
          toItems: items,
        });
      }
    },

    hover: (item: DragItem, monitor) => {
      if (!moving && !droppingInOut.current) {
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
  
        if (mLoc.hoverIdx !== undefined && item.index !== mLoc.hoverIdx) {
          // console.log('hover from', item.index, 'to', mLoc.hoverIdx);
          const toIdx = item.index < mLoc.hoverIdx ?
            (mLoc.side === 'right' ? mLoc.hoverIdx : mLoc.hoverIdx - 1) :
            (mLoc.side === 'right' ? mLoc.hoverIdx + 1 : mLoc.hoverIdx);
  
          if (item.index !== toIdx) {
            toIdRef.current = draggables[toIdx].getId();
            moveItem(item.index, toIdx);
            item.index = toIdx;
          }
        }
      }
    },
  });

  const onDragEnd = () => {
    console.log('onDragEnd')
  }

  const onDragEnter= canDropInOut ? (ev: DragEvent) => {
    const dragItem = dragDropManager.getMonitor().getItem() as DragItem;
    
    if (dragItem.type === accept &&
      ev.target === ev.currentTarget &&
      // Not to items inside the box
      ev.currentTarget &&
      !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
    ) {
      const newItems = [...items, dragItem.itemToDropIn ];
      setItems(newItems);
      dragItem.index = newItems.length - 1;
      droppingInOut.current = true;
      onDropIn(dragItem.itemToDropIn, newItems);
    }
  } : noop;

  const onDragLeave = canDropInOut ? (ev: DragEvent) => {
    const dragItem = dragDropManager.getMonitor().getItem() as DragItem;
    if (dragItem.type === accept &&
      ev.target === ev.currentTarget &&
      // Not to items inside the box
      ev.currentTarget &&
      !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
    ) {
      const newItems = items.toSpliced(dragItem.index, 1);
      setItems(newItems);
      droppingInOut.current = true;
      onDropOut(dragItem.id, newItems);
    }
  } : noop;

  return { draggablesRef, drop, items: items, onDragEnter, onDragLeave, onDragEnd };
}