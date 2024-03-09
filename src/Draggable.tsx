import { useImperativeHandle, useRef } from 'react';
import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';
import { DraggableProps } from './types';

export default function Draggable<InnerElementType>({
  canDrag = true,
  children,
  draggableRef,
  droppableBoxId,
  id,
  index,
  itemToDropIn,
  type,
}: DraggableProps<InnerElementType>) {
  const innerElementRef = useRef<InnerElementType>(null);

  useImperativeHandle(draggableRef, () => ({
    getDOMElement: () => innerElementRef.current as HTMLElement,
    getId: () => id,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const { drag, dragClassName, dragProps, isDragging } = useDrag({
    canDrag,
    droppableBoxId,
    id,
    index,
    itemToDropIn,
    type,
  });

  drag(innerElementRef);

  return (
    <Flipped key={id} flipId={id}>
      {flippedProps => children({
        canDrag,
        dragClassName,
        dragProps: {...dragProps, ...flippedProps},
        innerElementRef,
        isDragging
      })}
    </Flipped>
  );
}