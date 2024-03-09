import React, { FC, useState } from 'react';
import DroppableBox from '../DroppableBox';
import { ItemWithId } from '../types';

import './items.css';
import Item from './Item';

const defaultItems = [
  {
    id: '12',
  },
  {
    id: '13',
  },
  {
    id: '14',
  },
];

const Items2: FC = () => {
  const [ items, setItems ] = useState<ItemWithId[]>(defaultItems);

  const handleAdd = () => setItems([...items, { id: Date.now().toString()}]);
  const handleDelete = () => setItems(items.toSpliced(items.length - 1, 1));
  const handleDrop = (info) => {
    console.log(info);
    setItems(info.toItems);
  }
  const handleDragEnd= () => console.log('end');
  const handleDragStart = () => console.log('start');

  return (
    <>
      <DroppableBox
        id='g2'
        accept='myItem'
        canDropInOut={true}
        items={items}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        {({ draggableRefByIndex, drop, droppableBoxId, droppableProps, items }) => (
          <div className='items' ref={drop} {...droppableProps} >
            {items.map((item, idx) => (
              <Item key={item.id} id={item.id} idx={idx}
                droppableBoxId={droppableBoxId}
                draggableRef={draggableRefByIndex(idx)}
                itemToDropIn={item}
              />
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

export default Items2;