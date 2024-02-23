import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';
import { DraggableRenderProps } from './utils/types';

export default function Draggable({
  children,
  id,
  index,
}: {
  children: (props: DraggableRenderProps) => JSX.Element,
  id: number | string,
  index: number,
}) {
  const { drag, isDragging } = useDrag({
    id,
    index,
  })

  return (
    <Flipped key={id} flipId={id}>
      {flippedProps => children({drag, flippedProps, isDragging})}
    </Flipped>
  );
}