import React, { FC, useState } from 'react';
import DroppableBox from '../DroppableBox';
import { ItemWithId } from '../types';

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
  const [ items, setItems ] = useState<ItemWithId[]>(defaultItems);

  const handleAdd = () => setItems([...items, { id: Date.now().toString()}]);
  const handleDelete = () => setItems(items.toSpliced(items.length - 1, 1));
  const handleDragEnd = (newItems: ItemWithId[]) => {
    console.log(newItems);
    setItems(newItems);
  }
  
  return (
    <>
      <DroppableBox accept='myItem' items={items} onDragEnd={handleDragEnd}>
        {({ draggableRefByIndex, drop, items }) => (
          <div className='items' ref={drop}>
            {items.map((item, idx) => (
              <Item key={item.id} id={item.id} idx={idx}
                draggableRef={draggableRefByIndex(idx)} />
            ))}
          </div>
        )}
      </DroppableBox>
      <p>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleAdd}>Add</button>
      </p>
    </>
  );
};

export default Items;
