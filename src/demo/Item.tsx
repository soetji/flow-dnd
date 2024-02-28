import React, { Ref } from 'react';
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
  return (
    <Draggable<HTMLDivElement> id={id} index={idx} draggableRef={draggableRef}>
      {({flippedProps, innerElementRef, isDragging}) => {
        return (
          <div
            className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'} ${isDragging ? 'dragging' : ''}`}
            ref={innerElementRef}
            {...flippedProps}
          >
            <div className='bar'></div>
            <div className='content'>{id}</div>
          </div>
        )
      }}
    </Draggable>
  );
}