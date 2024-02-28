import { useImperativeHandle, Ref, useRef } from 'react';
import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';
import { DraggableHandle, DraggableRenderProps } from './types';

interface Props<InnerElementType> {
  children: (props: DraggableRenderProps<InnerElementType>) => JSX.Element,
  draggableRef: Ref<DraggableHandle>,
  id: number | string,
  index: number,
}

export default function Draggable<InnerElementType>({
  children,
  draggableRef,
  id,
  index,
}: Props<InnerElementType>) {
  const innerElementRef = useRef<InnerElementType>(null);

  useImperativeHandle(draggableRef, () => ({
    getDOMElement: () => innerElementRef.current,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const { drag, isDragging } = useDrag({
    id,
    index,
  });

  drag(innerElementRef);

  return (
    <Flipped key={id} flipId={id}>
      {flippedProps => children({flippedProps, innerElementRef, isDragging})}
    </Flipped>
  );
}