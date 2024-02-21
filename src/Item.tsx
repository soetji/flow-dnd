import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useDrag } from 'react-dnd';
import Chart from './Chart';

import './item.css';

interface Props {
  id: string;
  idx: number;
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

  const [{ isDragging }, drag] = useDrag({
    type: 'chart',
    item: () => {
      return { id, index: idx };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <div
      className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'} ${isDragging ? 'dragging' : ''}`}
      ref={ref}
      {...rest}
    >
      <div className='bar'>{id}</div>
      <Chart />
    </div>
  );
});
