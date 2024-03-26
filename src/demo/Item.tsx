import React, { Ref, useRef, MutableRefObject } from 'react';
import Draggable from '../Draggable';
import { DraggableHandle } from '../types';

import './item.css';

interface Props {
  id: string | number,
  draggableRef: Ref<DraggableHandle>,
  idx: number,
}

export default function Item({
  id,
  draggableRef,
  idx,
}: Props) {
  const itemRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement | null>;

  return (
    <Draggable<HTMLDivElement>
      id={id}
      index={idx}
      canDrag={id !== '10'}
      draggableRef={draggableRef}
      type='myItem'
    >
      {({ canDrag, dragClassName, dragProps, innerElementRef }) => {
        return (
          <div
            className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'} ${canDrag ? 'can-drag' : ''} ${dragClassName}`}
            ref={(el) => {
              innerElementRef && (innerElementRef.current = el);
              itemRef.current = el;
            }}
            {...dragProps}
          >
            <div className='bar'></div>
            <div className='content'>{id}</div>
            <div className='test-drag-overflow'>TEST</div>
          </div>
        );
      }}
    </Draggable>
  );
}