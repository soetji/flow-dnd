import { useState } from 'react';
import { Flipper } from 'react-flip-toolkit';

import useDropBox from './hooks/useDropBox';
import { DraggableHandle, DroppableBoxRenderProps, ItemWithId } from './types';

export default function DroppableBox({
  accept,
  children,
  items,
  onDragEnd,
} : {
  accept: string,
  children: (props: DroppableBoxRenderProps) => JSX.Element,
  items: ItemWithId[],
  onDragEnd?: (items: ItemWithId[]) => void,
}) {
  const [moving, setMoving] = useState(false);

  const { draggablesRef, drop, items: _items } = useDropBox({
    accept,
    moving,
    items,
    onDragEnd,
  });

  const draggableRefByIndex = (idx: number) =>
    (el: DraggableHandle) => (draggablesRef.current[idx] = el);

  const handleFlipperStart = () => setMoving(true);
  const handleFlipperComplete = () => setMoving(false);

  return (
    <Flipper flipKey={JSON.stringify(_items)}
      onStart={handleFlipperStart}
      onComplete={handleFlipperComplete}
    >
      {children({ draggableRefByIndex, drop, items: _items })}
    </Flipper>
  );
}