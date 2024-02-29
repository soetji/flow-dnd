import { useDrag } from 'react-dnd';

export default function _useDrag({
  canDrag = true,
  id,
  index,
  type,
}: {
  canDrag?: boolean,
  id: number | string,
  index: number,
  type: string,
}) {
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