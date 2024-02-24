import { FC } from 'react';
import DroppableBox from '../DroppableBox';

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
    type: 'sss'
  },
];

const Items: FC = () => {
  const handleDragEnd = (items) => console.log(items);
  
  return (
    <DroppableBox items={defaultItems} onDragEnd={handleDragEnd}>
      {({ childRefs, drop, items }) => (
        <div className='items' ref={drop}>
          {items.map((item, idx) => (
            <Item ref={childRefs[idx]} key={item.id} id={item.id} idx={idx} />
          ))}
        </div>
      )}
    </DroppableBox>
  );
};

export default Items;
