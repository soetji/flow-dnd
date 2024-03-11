import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { UseDragProps } from '../types';

import style from './use-drag.module.css';

export default function _useDrag({
  canDrag = true,
  id,
  index,
  itemToDropIn,
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
      return { id, index, itemToDropIn, type };
    },
    canDrag,
    // collect: (monitor) => ({
    //   isDragging: monitor.isDragging(),
    // }),
  });

  return { drag, dragClassName, dragProps, isDragging };
}