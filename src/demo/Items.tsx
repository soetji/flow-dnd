import React, { FC, useState } from 'react';
import DroppableBox from '../DroppableBox';
import { ItemWithId } from '../types';
// import useMountTest from '../hooks/useMountTest';

import { getIds } from '../utils';
import './items.css';
import Item from './Item';
import Items2 from './Items2';
// import Items3 from './Items3';

const defaultItems = [
  {
    id: '1',
    size: 'small',
  },
  {
    id: '2',
    size: 'large',
  },
  {
    id: '3',
    size: 'small',
  },
  {
    id: '4',
    size: 'large',
  },
  {
    id: '5',
    size: 'small',
  },
  {
    id: '6',
    size: 'large',
  },
  {
    id: '7',
    size: 'small',
  },
  {
    id: '8',
    size: 'large',
  },
  {
    id: '9',
    size: 'small',
  },
  {
    id: '10',
    size: 'large',
  },
  {
    id: '11',
    type: 'sss',
    size: 'small',
  },
];

const Items: FC = () => {
  const [ items, setItems ] = useState<ItemWithId[]>(defaultItems);
  // useMountTest('Items');
  
  const handleAdd = () => setItems([...items, { id: Date.now().toString()}]);
  const handleDelete = () => setItems(items.toSpliced(items.length - 1, 1));
  const handleDrop = (info) => {
    // console.log('handleDrop', info);
    setItems(info.toItems);
  }
  
  const handleDragStart = () => {
    // console.log('handleDragStart');
  }

  const handleDragEnter = (item, newItems) => {
    // console.log('handleDragEnter', item, getIds(newItems));
    setItems(newItems);
  }
  const handleDragLeave = (itemId, newItems) => {
    // console.log('handleDragLeave', itemId, getIds(newItems));
    setItems(newItems);
  }

  const handleDragEnd= (items, removedId) => {
    // console.log('handleDragEnd', removedId, getIds(items));
  }
  
  return (
    <>
      <DroppableBox
        accept='myItem'
        canDragInOut={true}
        // fixedItemIds={['1', '3']} // TODO
        items={items}
        onDragEnd={handleDragEnd}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        {({ draggableRefByIndex, droppableRef, droppableProps, items }) => (
          <div className='items' ref={droppableRef} {...droppableProps}>
            {(//console.log('items', getIds(items)),
              items.map((item, idx) => (
                <Item key={item.id} item={item} idx={idx}
                  draggableRef={draggableRefByIndex(idx)}
                />
              ))
            )}
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
