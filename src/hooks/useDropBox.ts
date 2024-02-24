import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

import { getMouseLocInfo } from '../utils/utils';
import { DropItem, MouseInfo, ItemWithId } from '../types';

export default function useDropBox({
  items,
  onDragEnd,
}: {
  items: ItemWithId[];
  onDragEnd?: (items: ItemWithId[]) => void,
}
) {

  const [_items, setItems] = useState(items);
  const childRefs = new Array(items.length);

  for (let i = 0; i < childRefs.length; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    childRefs[i] = useRef(null);
  }

  const moveItem = (from: number, to: number) => {
    const itemFrom = _items[from];
    setItems(_items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept: 'chart',

    drop: () => onDragEnd && onDragEnd(_items),

    hover: (item: DropItem, monitor) => {
      const clientOffset = monitor.getClientOffset();
      let msRes = { dist: Number.POSITIVE_INFINITY } as MouseInfo;

      if (childRefs.length) {
        for (let i = 0; i < childRefs.length; i++) {
          const obj = childRefs[i].current;
          const msInfo = getMouseLocInfo(
            obj?.getEl()?.getBoundingClientRect(),
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

  return { childRefs, drop, items: _items };
}