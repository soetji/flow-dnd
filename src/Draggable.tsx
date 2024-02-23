import { Flipped } from 'react-flip-toolkit';
import useDrag from './hooks/useDrag';

export default function Draggable({
  children,
  id,
  index,
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