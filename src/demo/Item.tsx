import React, { Ref, useRef, MutableRefObject } from 'react';
import Draggable from '../Draggable';
import { DraggableHandle, ItemWithId } from '../types';

import './item.css';

interface Props {
  id: string | number,
  droppableBoxId?: string | number,
  draggableRef: Ref<DraggableHandle>,
  idx: number,
  itemToDropIn: ItemWithId,
}

export default function Item({
  id,
  droppableBoxId,
  draggableRef,
  idx,
  itemToDropIn,
}: Props) {
  const itemRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement | null>;

  return (
    <Draggable<HTMLDivElement>
      id={id}
      droppableBoxId={droppableBoxId}
      index={idx}
      itemToDropIn={itemToDropIn}
      canDrag={id !== '10'}
      draggableRef={draggableRef}
      type='myItem'
    >
      {({ canDrag, dragClassName, dragProps, innerElementRef, isDragging }) => {
        return (
          <div
            className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'} ${canDrag ? 'can-drag' : ''} ${dragClassName} ${isDragging ? 'dragging' : '' }`}
            ref={(el) => {
              innerElementRef && (innerElementRef.current = el);
              itemRef.current = el;
            }}
            {...dragProps}
          >
            <div className='bar'></div>
            <div className='content'>{id}</div>
            <div className='test-out'>TEST</div>
          </div>
        );
      }}
    </Draggable>
  );
}