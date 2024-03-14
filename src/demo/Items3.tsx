import React, { FC, useState } from 'react';
import DroppableBox from '../DroppableBox';
import { ItemWithId } from '../types';

import './items.css';
import Item from './Item';

const defaultItems = [];

const Items3: FC = () => {
  const [ items, setItems ] = useState<ItemWithId[]>(defaultItems);

  const handleAdd = () => setItems([...items, { id: Date.now().toString()}]);
  const handleDelete = () => setItems(items.toSpliced(items.length - 1, 1));
  const handleDrop = (info) => {
    console.log('handleDrop', info);
    setItems(info.toItems);
  }
  const handleDragEnd= () => console.log('end');
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
        items={items}
        onDragEnd={handleDragEnd}
        onDragEnter={handleDropEnter}
        onDragLeave={handleDropLeave}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        {({ draggableRefByIndex, droppableRef, droppableProps, items }) => (
          <div className='items' ref={droppableRef} {...droppableProps} >
            {(//console.log(items),
              items.map((item, idx) => (
              <Item key={item.id} id={item.id} idx={idx}
                draggableRef={draggableRefByIndex(idx)}
              />
            )))}
            <div className='item large'>No Drag Item</div>
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

export default Items3;