import { Flipper } from 'react-flip-toolkit';

import useDropBox from './hooks/useDropBox';
import { DroppableBoxRenderProps, ItemWithId } from './utils/types';

export default function DroppableBox({
  children,
  items,
  onDragEnd,
} : {
  children: (props: DroppableBoxRenderProps) => JSX.Element,
  items: ItemWithId[],
  onDragEnd?: (items: ItemWithId[]) => void,
}) {
  const { childRefs, drop, items: _items } = useDropBox({
    items,
    onDragEnd,
  });

  return (
    <Flipper flipKey={JSON.stringify(_items)}>
      {children({ childRefs, drop, items: _items })}
    </Flipper>
  );
}