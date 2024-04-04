
import { useDrop } from 'react-dnd';
import { noop } from 'lodash';

import { DndItem, UseDropProps } from '../types';
import * as handlers from './useDropHandlers';

export default function _useDrop({
  accept,
  boxRef,
  canDrop = true,
  canHoverRef,
  defaultItems,
  draggablesRef,
  // fixedItemIds,
  items,
  moving,
  setItemsAndPrev,
  toIdRef,
  onDrop = noop,
}: UseDropProps) {
  const moveItem = (from: number, to: number) => {
    // console.log('moveItem', from, to, getIds(items));
    const itemFrom = items[from];
    setItemsAndPrev(items.toSpliced(from, 1).toSpliced(to, 0, itemFrom));
  };

  const [, drop] = useDrop({
    accept,
    canDrop: () => canDrop,

    drop: (dndItm: DndItem) => {
      handlers.onDrop({
        defaultItems,
        dndItm,
        draggablesRef,
        items,
        toIdRef,
        onDrop,
      })
    },

    hover: (dndItm: DndItem, monitor) => {
      handlers.onHover({
        boxRef,
        dndItm,
        draggablesRef,
        canHoverRef,
        monitor,
        moveItem,
        moving,
        toIdRef,
      })
    },
  });

  drop(boxRef);
}