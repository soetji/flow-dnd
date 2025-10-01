import { useState } from 'react';
import { useDrag as _useDrag } from 'react-dnd';
import { DndItem, UseDragProps } from '../types';

import styles from './styles.module.css';

export default function useDrag({
  canDrag = true,
  id,
  index,
  type,
}: UseDragProps) {
  // Use this dragging instead of what is provided by _useDrag().
  // This dragging from collect() is one react cycle late.
  const [dragging, setDragging] = useState(false);

  // const [{ dragging: _isDragging }, drag] = _useDrag({
  const [, drag, preview] = _useDrag({
    type,
    item: () => {
      return { id, index, type } as DndItem;
    },
    canDrag: () => canDrag,
    // collect: (monitor) => ({
    //   dragging: monitor.dragging()
    // }),
  });

  const dragProps = canDrag ? {
    onDragEnd: () => setDragging(false),
    onDragStart: () => setDragging(true),
  } : {}

  const dragClassName = `__flow-dnd-drag-item ${dragging ? styles.itemDragging : ''}`;
  // console.log({dragClassName});
  

  return { drag, dragClassName, dragProps, dragging, previewConnect: preview };
}