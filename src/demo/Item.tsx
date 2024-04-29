import React, { Ref, useRef, MutableRefObject } from 'react';
import Draggable from '../Draggable';
import { DraggableImpHandle, ItemWithId } from '../types';

import './item.css';

interface Props {
  draggableRef: Ref<DraggableImpHandle>,
  idx: number,
  item: ItemWithId,
}

const sizeClassname = (size) =>
  size === 'small' ? 'small' :
  size === 'large' ? 'large' :
  size === 'fullWidth' ? 'full-width' : 'small';

export default function Item({
  draggableRef,
  idx,
  item,
}: Props) {
  const itemRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement | null>;
  const id = item.id;

  return (
    <Draggable<HTMLDivElement | null>
      id={id}
      index={idx}
      canDrag={id !== '10'}
      draggableRef={draggableRef}
      type='myItem'
    >
      {({ canDrag, dragClassName, dragHandleRef, dragProps, previewConnect }) => {
        return (
          <div
            className={`item ${sizeClassname(item.size)} ${canDrag ? 'can-drag' : ''} ${dragClassName}`}
            ref={(el) => {
              if (id === '14') {
                previewConnect && previewConnect(el);
              } else {
                dragHandleRef && (dragHandleRef.current = el);
              }
              itemRef.current = el;
            }}
            {...dragProps}
          >
            <div className='bar' ref={id === '14' ? dragHandleRef : undefined}></div>
            <div className='content'>{id}</div>
            <div className='test-drag-overflow'>TEST</div>
          </div>
        );
      }}
    </Draggable>
  );
}