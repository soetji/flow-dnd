import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { DndItem, UseDragProps } from '../types';

import style from './drag.module.css';

export default function _useDrag({
  canDrag = true,
  id,
  index,
  type,
}: UseDragProps) {
  // Use this dragging instead of what is provided by useDrag().
  // This dragging from collect() is one react cycle late.
  const [dragging, setDragging] = useState(false);

  // const [{ dragging: _isDragging }, drag] = useDrag({
  const [, drag] = useDrag({
    type,
    item: () => {
      return { id, index, type } as DndItem;
    },
    canDrag,
    // collect: (monitor) => ({
    //   dragging: monitor.dragging()
    // }),
  });

  const dragProps = {
    onDragEnd: () => setDragging(false),
    onDragStart: () => setDragging(true),
  }

  const dragClassName = dragging ? style.dragging : '';

  return { drag, dragClassName, dragProps, dragging };
}