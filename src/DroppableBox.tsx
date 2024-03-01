import { Flipper } from 'react-flip-toolkit';

import useDropBox from './hooks/useDropBox';
import { DraggableHandle, DroppableBoxRenderProps, ItemWithId } from './types';

export default function DroppableBox({
  accept,
  children,
  items,
  onDragEnd,
} : {
  accept: string,
  children: (props: DroppableBoxRenderProps) => JSX.Element,
  items: ItemWithId[],
  onDragEnd?: (items: ItemWithId[]) => void,

}) {
  const { draggablesRef, drop, items: _items } = useDropBox({
    accept,
    items,
    onDragEnd,
  });

  const draggableRefByIndex = (idx: number) =>
    (el: DraggableHandle) => (draggablesRef.current[idx] = el);

  return (
    <Flipper flipKey={JSON.stringify(_items)}>
      {children({ draggableRefByIndex, drop, items: _items })}
    </Flipper>
  );
}