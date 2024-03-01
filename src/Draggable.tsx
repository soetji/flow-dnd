import { useImperativeHandle, Ref, useRef } from 'react';
import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';
import { DraggableHandle, DraggableRenderProps } from './types';

interface Props<InnerElementType> {
  canDrag?: boolean,
  children: (props: DraggableRenderProps<InnerElementType>) => JSX.Element,
  draggableRef: Ref<DraggableHandle>,
  id: number | string,
  index: number,
  type: string,
}

export default function Draggable<InnerElementType>({
  canDrag = true,
  children,
  draggableRef,
  id,
  index,
  type,
}: Props<InnerElementType>) {
  const innerElementRef = useRef<InnerElementType>(null);

  useImperativeHandle(draggableRef, () => ({
    getDOMElement: () => innerElementRef.current,
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