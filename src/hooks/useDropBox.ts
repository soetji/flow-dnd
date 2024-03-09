import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import { getMouseLocInfo } from '../utils/utils';
import { DraggableHandle, DragItem, ItemId, MouseInfo, UseDropBoxProps } from '../types';

export default function useDropBox({
  id,
  accept,
  canDropInOut = false,
  // fixedItemIds,
  items,
  moving,
  onDrop,
}: UseDropBoxProps) {
  const [_items, setItems] = useState(items);
  const draggablesRef = useRef<DraggableHandle[]>([]);
  const toIdRef = useRef<ItemId>(null) as MutableRefObject<ItemId>;
  const dragDropManager = useDragDropManager();

  useEffect(() => {
    setItems(items);
    // setTimeout() to execute after draggablesRef is updated
    setTimeout(() =>
      // Clean up draggablesRef
      draggablesRef.current = draggablesRef.current.filter(dr => dr !== null)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  useEffect(() => {
    // setTimeout() to execute after draggablesRef is updated
    setTimeout(() =>
      // Clean up draggablesRef
      draggablesRef.current = draggablesRef.current.filter(dr => dr !== null)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(_items)]);

  const moveItem = (from: number, to: number) => {
    const itemFrom = _items[from];
    setItems(_items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept,

    drop: (item: DragItem) => {
      if (onDrop && toIdRef.current !== null &&
        !isEqual(items, _items)
      ) {
        onDrop({
          fromId: item.id,
          fromItems: items,
          toId: toIdRef.current,
          toItems: _items,
        });
      }
    },

    hover: (item: DragItem, monitor) => {
      if (!moving) {
        const clientOffset = monitor.getClientOffset();
        const draggables = draggablesRef.current;
        let msRes = { dist: Number.POSITIVE_INFINITY } as MouseInfo;
  
        if (draggables.length) {
          for (let i = 0; i < draggables.length; i++) {
            const msInfo = getMouseLocInfo(
              draggables[i].getDOMElement()?.getBoundingClientRect(),
              clientOffset
            );
  
            if (msInfo.isInside) {
              msRes = { ...msInfo, hoverIdx: i };
              break;
            }
  
            if (msInfo.dist && msRes.dist && msInfo.dist < msRes.dist) {
              msRes = { ...msInfo, hoverIdx: i };
            }
          }
        }
  
        if (msRes.hoverIdx !== undefined && item.index !== msRes.hoverIdx) {
          const toIdx = item.index < msRes.hoverIdx ?
            (msRes.side === 'right' ? msRes.hoverIdx : msRes.hoverIdx - 1) :
            (msRes.side === 'right' ? msRes.hoverIdx + 1 : msRes.hoverIdx);
  
          if (item.index !== toIdx) {
            toIdRef.current = draggables[toIdx].getId();
            moveItem(item.index, toIdx);
            item.index = toIdx;
          }
        }
      }
    },
  });

  const onDragEnter= canDropInOut ? (ev) => {
    const dragItem = dragDropManager.getMonitor().getItem();
      if (dragItem.droppableBoxId === id && ev.target === ev.currentTarget &&
        !ev.currentTarget.contains(ev.relatedTarget)
      ) {
      console.log('onDragEnter', _items);
      const newItems = [..._items, dragItem.itemToDropIn ];
      setItems(newItems);
      dragItem.index = newItems.length - 1;
    }
  } : noop;

  const onDragLeave = canDropInOut ? (ev) => {
    const dragItem = dragDropManager.getMonitor().getItem();
    if (dragItem.droppableBoxId === id && ev.target === ev.currentTarget) {
      console.log('onDragLeave', _items);
      setItems(_items.toSpliced(dragItem.index, 1));
    }
  } : noop;

  return { draggablesRef, drop, items: _items, onDragEnter, onDragLeave };
}