import { MutableRefObject, useImperativeHandle, useRef } from 'react';
// import { useEffect } from 'react';
import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';
import { DraggableProps } from './types';

export default function Draggable<dragElementType>({
  canDrag = true,
  children,
  draggableRef,
  id,
  index,
  type,
}: DraggableProps<dragElementType>) {
  const dragElementRef = useRef<dragElementType>(null) as MutableRefObject<dragElementType>;

  // useEffect(() => {
  //   console.log('mount', id);
  // }, []);

  useImperativeHandle(draggableRef, () => ({
    getDOMElement: () => dragElementRef.current as HTMLElement,
    getId: () => id,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const { drag, dragClassName, dragProps, dragging, previewConnect } = useDrag({
    canDrag,
    id,
    index,
    type,
  });

  drag(dragElementRef);

  return (
    <Flipped key={id} flipId={id}>
      {flippedProps => children({
        canDrag,
        dragClassName,
        dragElementRef,
        dragProps: {...dragProps, ...flippedProps},
        dragging,
        previewConnect,
      })}
    </Flipped>
  );
}