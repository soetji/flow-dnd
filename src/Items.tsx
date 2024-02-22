import { FC, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { shuffle } from 'lodash';

import './items.css';
import Item from './Item';

const defaultItems = [
  {
    id: '1',
  },
  {
    id: '2',
  },
  {
    id: '3',
  },
  {
    id: '4',
  },
  {
    id: '5',
  },
  {
    id: '6',
  },
  {
    id: '7',
  },
  {
    id: '8',
  },
  {
    id: '9',
  },
  {
    id: '10',
  },
  {
    id: '11',
  },
];

interface Offset {
  x: number;
  y: number;
}

interface MouseInfo {
  isInside?: boolean,
  dist?: number;
  hoverIdx?: number;
  side?: string;
}

function getMouseLocInfo(
  itemRect: DOMRect | null = null,
  { x, y }: Offset
): MouseInfo {
  if (itemRect === null) return {};

  if (y >= itemRect.top && y <= itemRect.bottom) {
    if (x >= itemRect.right) {
      return {
        isInside: false,
        side: 'right',
        dist: x - itemRect.right,
      };
    } else if (x >= itemRect.left) {
      const rectMidX = (itemRect.right + itemRect.left) / 2;

      return {
        isInside: true,
        side: x > rectMidX ? 'right' : 'left',
      };
    }

    return {
      isInside: false,
      side: 'left',
      dist: itemRect.left - x,
    };
  }
  return {};
}

const Items: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(defaultItems);
  const childRefs = new Array(defaultItems.length);
  for (let i = 0; i < childRefs.length; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    childRefs[i] = useRef<typeof Item>(null);
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

  drop(ref);

  const handleShuffle = () => setItems(shuffle(items));

  return (
    <Flipper flipKey={JSON.stringify(items)}>
      <button onClick={handleShuffle}>Shuffle</button>
      <div className='items' ref={ref}>
        {items.map((item, idx) => (
          <Flipped key={item.id} flipId={item.id} opacity={false}>
            <Item ref={childRefs[idx]} key={item.id} id={item.id} idx={idx} />
          </Flipped>
        ))}
      </div>
    </Flipper>
  );
};

export default Items;
