import { MutableRefObject, useImperativeHandle, useRef } from 'react';
// import { useEffect } from 'react';
import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';
import { DraggableProps } from './types';
import { getDragStartEl } from './hooks/utils';

export default function Draggable<dragElementType>({
  canDrag = true,
  children,
  draggableRef,
  id,
  index,
  type,
}: DraggableProps<dragElementType>) {
  const dragHandleRef = useRef<dragElementType>(null) as MutableRefObject<dragElementType>;

  useImperativeHandle(draggableRef, () => ({
    getDOMElement: () => getDragStartEl(dragHandleRef.current as HTMLElement),
    getId: () => id,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const { drag, dragClassName, dragProps, dragging, previewConnect } = useDrag({
    canDrag,
    id,
    index,
    type,
  });

  drag(dragHandleRef);

  // Clear style left by Flipped
  const onComplete = (el: HTMLElement) =>  el.attributeStyleMap.clear();

  return (
    <Flipped key={id} flipId={id}
      onComplete={onComplete}
    >
      {flippedProps => children({
        canDrag,
        dragClassName,
        dragHandleRef,
        dragProps: {...dragProps, ...flippedProps},
        dragging,
        previewConnect,
      })}
    </Flipped>
  );
}