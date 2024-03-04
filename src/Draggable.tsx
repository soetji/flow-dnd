import { useImperativeHandle, useRef } from 'react';
import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';
import { DraggableProps } from './types';

export default function Draggable<InnerElementType>({
  canDrag = true,
  children,
  draggableRef,
  id,
  index,
  type,
}: DraggableProps<InnerElementType>) {
  const innerElementRef = useRef<InnerElementType>(null);

  useImperativeHandle(draggableRef, () => ({
    getDOMElement: () => innerElementRef.current as HTMLElement,
    getId: () => id,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const { drag, isDragging } = useDrag({
    canDrag,
    id,
    index,
    type,
  });

  drag(innerElementRef);

  return (
    <Flipped key={id} flipId={id}>
      {flippedProps => children({canDrag, flippedProps, innerElementRef, isDragging})}
    </Flipped>
  );
}