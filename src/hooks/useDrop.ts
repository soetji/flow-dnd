import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { getMouseLocInfo, MouseInfo } from './utils';

export default function _useDrop({
  defaultItems,
}) {

  const [items, setItems] = useState(defaultItems);
  const childRefs = new Array(defaultItems.length);

  for (let i = 0; i < childRefs.length; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    childRefs[i] = useRef(null);
  }

  const moveItem = (from: number, to: number) => {
    const itemFrom = items[from];
    setItems(items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept: 'chart',

    hover: (item, monitor) => {
      // const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      // console.log('hover', childRefs, item, clientOffset, monitor, monitor.getItem(), ref.current?.children);


      let mRes = { dist: Number.POSITIVE_INFINITY } as MouseInfo;

      if (childRefs.length) {
        for (let i = 0; i < childRefs.length; i++) {
          const obj = childRefs[i].current;
          const mInfo = getMouseLocInfo(
            obj?.getEl()?.getBoundingClientRect(),
            clientOffset
          );

          if (mInfo.isInside) {
            mRes = { ...mInfo, hoverIdx: i };
            break;
          }

          if (mInfo.dist && mInfo.dist < mRes.dist) {
            mRes = { ...mInfo, hoverIdx: i };
          }
        }
      }

      if (mRes.hoverIdx !== undefined && item.index !== mRes.hoverIdx) {
        const toIdx = item.index < mRes.hoverIdx ?
          (mRes.side === 'right' ? mRes.hoverIdx : mRes.hoverIdx - 1) :
          (mRes.side === 'right' ? mRes.hoverIdx + 1 : mRes.hoverIdx);

        if (item.index !== toIdx) {
          moveItem(item.index, toIdx);
          item.index = toIdx;
        }
      }
    },
  });

  return { childRefs, drop, items }

}