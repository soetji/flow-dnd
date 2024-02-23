import { Flipper } from 'react-flip-toolkit';
import useDrop from './hooks/useDrop';

export default function Droppable({
  children,
  defaultItems,
  flipKey,
}) {
  const { childRefs, drop, items } = useDrop({
    defaultItems,
  });

  return (
    <Flipper flipKey={JSON.stringify(items)}>
      {children({ childRefs, drop, items })}
    </Flipper>
  );
}