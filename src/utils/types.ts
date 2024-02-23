import { Ref } from 'react';
import { ConnectDragSource, ConnectDropTarget } from 'react-dnd';

export interface DraggableRenderProps {
  drag: ConnectDragSource,
  flippedProps: object,
  isDragging: boolean,
}

export interface DroppableRenderProps {
  childRefs: Ref<HTMLElement>[],
  drop: ConnectDropTarget,
  items: ItemWithId[],
}

// TODO: Find this in react-dnd
export interface DropItem {
  id: number | string,
  index: number,
}

export interface Item {
  id: number | string
}

// Generic ItemWithId that is constrained to Item
export interface ItemWithId extends Item {
  [key: string]: unknown,
}

export interface MouseInfo {
  isInside?: boolean,
  dist?: number;
  hoverIdx?: number;
  side?: string;
}