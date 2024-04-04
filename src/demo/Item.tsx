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
    <Draggable<HTMLDivElement | null>
      id={id}
      index={idx}
      canDrag={id !== '10'}
      draggableRef={draggableRef}
      type='myItem'
    >
      {({ canDrag, dragClassName, dragElementRef, dragProps, previewConnect }) => {
        return (
          <div
            className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'} ${canDrag ? 'can-drag' : ''} ${dragClassName}`}
            ref={(el) => {
              if (id === '14') {
                previewConnect && previewConnect(el);
              } else {
                dragElementRef && (dragElementRef.current = el);
              }
              itemRef.current = el;
            }}
            {...dragProps}
          >
            <div className='bar' ref={id === '14' ? dragElementRef : undefined}></div>
            <div className='content'>{id}</div>
            <div className='test-drag-overflow'>TEST</div>
          </div>
        );
      }}
    </Draggable>
  );
}