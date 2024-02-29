import { useDrag } from 'react-dnd';

export default function _useDrag({
  id,
  index,
  type,
}: {
  id: number | string,
  index: number,
  type: string,
}) {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { drag, isDragging };
}