import { useState } from 'react';
import { Flipper } from 'react-flip-toolkit';

import useDropBox from './hooks/useDropBox';
import { DraggableHandle, DroppableBoxProps } from './types';

export default function DroppableBox({
  accept,
  children,
  // fixedItemIds, // TODO
  items,
  onDragEnd,
  onDragStart,
  onDrop,
} : DroppableBoxProps) {
  const [moving, setMoving] = useState(false);

  const { draggablesRef, drop, items: _items } = useDropBox({
    accept,
    // fixedItemIds,
    moving,
    items,
    onDrop,
  });

  const draggableRefByIndex = (idx: number) =>
    (el: DraggableHandle) => (draggablesRef.current[idx] = el);
  const droppableProps = { onDragEnd, onDragStart };

  const handleFlipperStart = () => setMoving(true);
  const handleFlipperComplete = () => setMoving(false);

  return (
    <Flipper flipKey={JSON.stringify(_items)}
      onStart={handleFlipperStart}
      onComplete={handleFlipperComplete}
    >
      {children({ draggableRefByIndex, drop, droppableProps, items: _items })}
    </Flipper>
  );
}