import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';
import { isEqual, noop } from 'lodash';

import { getMouseLocInfo } from '../utils/utils';
import {
  DraggableHandle, DndItem, ItemId,
  ItemWithId, MouseInfo, UseDropBoxProps
} from '../types';
import style from './use-drag.module.css';

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

  const _onDragEnd = () => {
    onDragEnd();
  };

  const _onDragEnter = canDragInOut ? (ev: DragEvent) => {
    const dndItm = dragDropManager.getMonitor().getItem();
    if (dndItm.boxToLeave !== ev.currentTarget) {
      ev.preventDefault();

      if (dndItm.type === accept &&
        ev.target === ev.currentTarget &&
        // Not to items inside the box
        ev.currentTarget &&
        !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
      ) {
        dndItm.leave();

        const newItem = dndItm.itemToDragEnter as ItemWithId;
        const newItems = [...items, newItem];
        setItems(newItems);
        dndItm.index = newItems.length - 1;
        draggingInOut.current = true;
        onDragEnter(newItem, newItems);
        
        setTimeout(() => {
          draggablesRef.current[dndItm.index].getDOMElement()
            .classList.add(style.dragging);
        });
      }

    }
  } : onDragEnter();

  const itemLeave = (id: ItemId, idx: number) => () => {
    const newItems = items.toSpliced(idx, 1);
    setItems(newItems);
    draggingInOut.current = true;
    onDragLeave(id, newItems);
  };

  const _onDragLeave = canDragInOut ? (ev: DragEvent) => {
    const dndItm = dragDropManager.getMonitor().getItem();

    if (dndItm.type === accept &&
      ev.target === ev.currentTarget &&
      // Not to items inside the box
      ev.currentTarget &&
      !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
    ) {
      dndItm.leave = itemLeave(dndItm.id, dndItm.index);
      dndItm.boxToLeave = ev.currentTarget;
    }
  } : onDragLeave();

  const _onDragStart = () => {
    onDragStart();
    setTimeout(() => {
      const dndItm = dragDropManager.getMonitor().getItem();
      dndItm.itemToDragEnter = items[dndItm.index];
    });
  };

  return {
    draggablesRef,
    drop,
    items,
    droppableProps: {
      onDragEnd: _onDragEnd,
      onDragEnter: _onDragEnter,
      onDragLeave: _onDragLeave,
      onDragStart: _onDragStart,
    }
  };
}