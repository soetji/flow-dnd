import { useDrag } from 'react-dnd';


export default function _useDrag({
  id,
  index,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'chart',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { drag, isDragging };
}