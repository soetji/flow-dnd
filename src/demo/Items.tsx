import React, { FC, useState } from 'react';
import DroppableBox from '../DroppableBox';
import { ItemWithId } from '../types';

import './items.css';
import Item from './Item';
import Items2 from './Items2';
import Items3 from './Items3';

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
  const handleDrop = (info) => {
    console.log('handleDrop', info);
    setItems(info.toItems);
  }
  const handleDragEnd = () => console.log('end');
  const handleDragStart = () => console.log('start');

  const handleDropEnter = (item, newItems) => {
    console.log('handleDropEnter', item, newItems);
    setItems(newItems);
  }

  const handleDropLeave = (itemId, newItems) => {
    console.log('handleDropLeave', itemId, newItems);
    setItems(newItems);
  }
  
  return (
    <>
      <DroppableBox
        accept='myItem'
        canDragInOut={true}
        // fixedItemIds={['1', '3']} // TODO
        items={items}
        onDragEnd={handleDragEnd}
        onDragEnter={handleDropEnter}
        onDragLeave={handleDropLeave}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        {({ draggableRefByIndex, droppableRef, droppableProps, items }) => (
          <div className='items' ref={droppableRef} {...droppableProps}>
            {items.map((item, idx) => (
              <Item key={item.id} id={item.id} idx={idx}
                draggableRef={draggableRefByIndex(idx)}
              />
            ))}
          </div>
        )}
      </DroppableBox>
      <p>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleAdd}>Add</button>
      </p>
      <Items2 />
      {/* <Items3 /> */}
    </>
  );
};

export default Items;
