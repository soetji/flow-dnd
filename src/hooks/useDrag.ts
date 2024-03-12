import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { UseDragProps } from '../types';

import style from './use-drag.module.css';

export default function _useDrag({
  canDrag = true,
  id,
  index,
  type,
}: UseDragProps) {
  // Use this isDragging instead of what is provided by useDrag().
  // This isDragging from collect() is one react cycle late.
  const [isDragging, setIsDragging] = useState(false);

  const dragProps = {
    onDragEnd: () => setIsDragging(false),
    onDragStart: () => setIsDragging(true),
  }

  const dragClassName = isDragging ? style['is-dragging'] : '';

  const [, drag] = useDrag({
    type,
    item: () => {
      return { id, index, type };
    },
    canDrag,
    // collect: (monitor) => ({
    //   toLeave: monitor.getItem()?.toLeave,
    //   // isDragging: monitor.isDragging(),
    // }),
  });

  // console.log(toLeave);

  return { drag, dragClassName, dragProps, isDragging };
}