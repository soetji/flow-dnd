import React, { Ref, useRef } from 'react';
import Draggable from '../Draggable';
import { DraggableHandle } from '../types';

import './item.css';

interface Props {
  draggableRef: Ref<DraggableHandle>,
  id: string | number;
  idx: number;
}

export default function Item({
  draggableRef,
  id,
  idx,
}: Props) {
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable<HTMLDivElement> id={id} index={idx} draggableRef={draggableRef} type='myItem'>
      {({ flippedProps, innerElementRef, isDragging }) => {
        return (
          <div
            className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'} ${isDragging ? 'dragging' : ''}`}
            ref={el => {
              innerElementRef && (innerElementRef.current = el);
              itemRef.current = el;
            }}
            {...flippedProps}
          >
            <div className='bar'></div>
            <div className='content'>{id}</div>
          </div>
        );
      }}
    </Draggable>
  );
}