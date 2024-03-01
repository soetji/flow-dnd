import { Flipper } from 'react-flip-toolkit';

import useDropBox from './hooks/useDropBox';
import { DroppableBoxRenderProps, ItemWithId } from './types';

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

  return (
    <Flipper flipKey={JSON.stringify(_items)}>
      {children({ draggablesRef, drop, items: _items })}
    </Flipper>
  );
}