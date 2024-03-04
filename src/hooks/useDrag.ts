import { useDrag } from 'react-dnd';
import { UseDragProps } from '../types';

export default function _useDrag({
  canDrag = true,
  id,
  index,
  type,
}: UseDragProps) {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => {
      return { id, index };
    },
    canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { drag, isDragging };
}