import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

import { getMouseLocInfo } from '../utils/utils';
import { DraggableHandle, DragItem, MouseInfo, ItemWithId } from '../types';

export default function useDropBox({
  accept,
  items,
  onDragEnd,
}: {
  accept: string,
  items: ItemWithId[];
  onDragEnd?: (items: ItemWithId[]) => void,
}
) {
  const [_items, setItems] = useState(items);
  const draggablesRef = useRef<DraggableHandle[]>([]);

  useEffect(() => {
    setItems(items);
    // setTimeout() to execute after draggablesRef is updated
    setTimeout(() =>
      // Clean up draggablesRef
      draggablesRef.current = draggablesRef.current.filter(dr => dr !== null)
    );
  }, [JSON.stringify(items)]);

  const moveItem = (from: number, to: number) => {
    const itemFrom = _items[from];
    setItems(_items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept,

    drop: () => onDragEnd && onDragEnd(_items),

    hover: (item: DragItem, monitor) => {
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
          moveItem(item.index, toIdx);
          item.index = toIdx;
        }
      }
    },
  });

  return { draggablesRef, drop, items: _items };
}