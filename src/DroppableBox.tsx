import { useState } from 'react';
import { Flipper } from 'react-flip-toolkit';
// import { ItemWithId } from './types';

import useDropBox from './hooks/useDropBox';
import { DraggableImpHandle, DroppableBoxProps } from './types';

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
    draggableImpsRef,
    draggingTs,
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
    (handleEl: DraggableImpHandle) => {
      handleEl && (draggableImpsRef.current[idx] = handleEl);
      // console.log('draggableRefByIndex', idx, handleEl && handleEl.getId(), draggableImpsRef.current, draggableImpsRef.current.length);
    }

  // console.log('draggableImpsRef.current', draggableImpsRef.current, JSON.stringify([..._items, draggingTs]));

  // Only on items change
  const handleFlipperStart = () => setMoving(true);
  const handleFlipperComplete = () => setMoving(false);

  // const getIds = (items: ItemWithId[]) => items.map(it => it.id);
  // console.log('DroppableBox', getIds(_items));
  
  // return children({ draggableRefByIndex, droppableRef,
  //   droppableProps, items: _items });

  return (
    <Flipper flipKey={JSON.stringify([..._items, draggingTs])}
      onStart={handleFlipperStart}
      onComplete={handleFlipperComplete}
    >
      {children({ draggableRefByIndex, droppableRef,
        droppableProps, items: _items })}
    </Flipper>
  );
}