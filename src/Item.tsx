import { useRef, forwardRef, useImperativeHandle } from 'react';
import Chart from './Chart';
import Draggable from './Draggable';

import './item.css';

interface Props {
  id: string | number;
  idx: number;
}

type Ref = object;

export default forwardRef<Ref, Props>(function Item({
  id,
  idx,
}, objRef) {
  const ref = useRef<HTMLDivElement>(null);

  useImperativeHandle(objRef, () => ({
    getEl: () => ref.current,
    getId: () => id,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  return (
    <Draggable id={id} index={idx}>
      {({drag, isDragging, flippedProps}) => {
        drag(ref);
        return (
          <div
            className={`item ${Number(id) % 2 === 1 ? 'small' : 'large'} ${isDragging ? 'dragging' : ''}`}
            ref={ref}
            {...flippedProps}
          >
            <div className='bar'>{id}</div>
            <Chart />
          </div>
        )
      }}
    </Draggable>
  );
});
