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
    console.log('handleDrop', info);
    setItems(info.toItems);
  }
  

  const handleDragStart = () => console.log('handleDragStart');

  const handleDragEnter = (item, newItems) => {
    console.log('handleDragEnter', item, newItems);
    setItems(newItems);
  }
  const handleDragLeave = (itemId, newItems) => {
    console.log('handleDragLeave', itemId, newItems);
    setItems(newItems);
  }

  const handleDragEnd = (removedId, items) => {
    console.log('handleDragEnd', removedId, items);
  }

  return (
    <>
      <DroppableBox
        accept='myItem'
        canDragInOut={true}
        items={items}
        onDragEnd={handleDragEnd}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        {({ draggableRefByIndex, droppableProps, droppableRef, items }) => (
          <div className='items' ref={droppableRef} {...droppableProps} >
            {(//console.log('item2', items),
              items.map((item, idx) => (
              <Item key={item.id} id={item.id} idx={idx}
                draggableRef={draggableRefByIndex(idx)}
              />
            )))}
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