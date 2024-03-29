import { useState } from 'react';
import { Flipper } from 'react-flip-toolkit';

import useDropBox from './hooks/useDropBox';
import { DraggableHandle, DroppableBoxProps } from './types';

export default function DroppableBox({
  accept,
  canDragInOut = false,
  canDrop = true,
  children,
  // fixedItemIds, // TODO
  items,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragStart,
  onDrop,
} : DroppableBoxProps) {
  const [moving, setMoving] = useState(false);

  const {
    draggablesRef,
    droppableRef,
    items: _items,
    droppableProps,
  } = useDropBox({
    accept,
    canDragInOut,
    canDrop,
    // fixedItemIds,
    moving,
    items,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragStart,
    onDrop,
  });

  const draggableRefByIndex = (idx: number) =>
    (el: DraggableHandle) => (draggablesRef.current[idx] = el);

  // Only on items change
  const handleFlipperStart = () => setMoving(true);
  const handleFlipperComplete = () => setMoving(false);

  return (
    <Flipper flipKey={JSON.stringify(_items)}
      onStart={handleFlipperStart}
      onComplete={handleFlipperComplete}
    >
      {children({ draggableRefByIndex, droppableRef,
        droppableProps, items: _items })}
    </Flipper>
  );
}