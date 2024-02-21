import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Chart from './Chart';

import './item.css';

interface Props {
  id: string;
  idx: number;
  // moveCard: (dragIndex: number, hoverIndex: number) => void;
}

type Ref = object;

export default forwardRef<Ref, Props>(function Item({
  id,
  idx,
  ...rest
}, objRef) {
  const ref = useRef<HTMLDivElement>(null);

  useImperativeHandle(objRef, () => ({
    getEl: () => ref.current,
    getId: () => id,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  // const [{ handlerId }, drop] = useDrop({
  //   accept: 'chart',
  //   collect(monitor) {
  //     return {
  //       handlerId: monitor.getHandlerId(),
  //     };
  //   },
  //   hover(item, monitor) {
  //     return;
  //     if (!ref.current) {
  //       return;
  //     }
  //     const dragIndex = item.index;
  //     const hoverIndex = idx;
  //     console.log(dragIndex, hoverIndex);
  //     // Don't replace items with themselves
  //     if (dragIndex === hoverIndex) {
  //       return;
  //     }
  //     // Determine rectangle on screen
  //     const hoverBoundingRect = ref.current?.getBoundingClientRect();
  //     // Get vertical middle
  //     // const hoverMiddleY =
  //     //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  //     // Get vertical middle
  //     const hoverMiddleX =
  //       (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
  //     // Determine mouse position
  //     const clientOffset = monitor.getClientOffset();
  //     // Get pixels to the top
  //     // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  //     const hoverClientX = clientOffset.x - hoverBoundingRect.left;
  //     // Only perform the move when the mouse has crossed half of the items height
  //     // When dragging downwards, only move when the cursor is below 50%
  //     // When dragging upwards, only move when the cursor is above 50%

  //     // Dragging downwards
  //     // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
  //     //   return;
  //     // }
  //     // // Dragging upwards
  //     // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
  //     //   return;
  //     // }

  //     // Dragging right
  //     if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
  //       return;
  //     }
  //     // Dragging left
  //     if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
  //       return;
  //     }
  //     // Time to actually perform the action
  //     moveCard(dragIndex, hoverIndex);
  //     // Note: we're mutating the monitor item here!
  //     // Generally it's better to avoid mutations,
  //     // but it's good here for the sake of performance
  //     // to avoid expensive index searches.
  //     item.index = hoverIndex;
  //   },
  // });

  const [{ isDragging }, drag] = useDrag({
    type: 'chart',
    item: () => {
      return { id, index: idx };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.3 : 1;
  console.log(opacity);
  
  // drag(drop(ref));
  drag(ref);

  return (
    <div
      className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'}`}
      style={{ opacity }}
      ref={ref}
      // data-handler-id={handlerId}
      {...rest}
    >
      <div className='bar'>{id}</div>
      <Chart />
    </div>
  );
});
