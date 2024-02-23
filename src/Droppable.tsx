import { Flipper } from 'react-flip-toolkit';
import useDrop from './hooks/useDrop';
import { DroppableRenderProps, ItemWithId } from './utils/types';

// Generic ItemWithId that is constrained to Item
export default function Droppable({
  children,
  items,
} : {
  children: (props: DroppableRenderProps) => JSX.Element,
  items: ItemWithId[],
}) {
  const { childRefs, drop, items: _items } = useDrop({
    items,
  });

  return (
    <Flipper flipKey={JSON.stringify(_items)}>
      {children({ childRefs, drop, items: _items })}
    </Flipper>
  );
}