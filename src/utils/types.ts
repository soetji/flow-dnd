import { Ref } from 'react';
import { ConnectDragSource, ConnectDropTarget } from 'react-dnd';

export interface DraggableRenderProps {
  drag: ConnectDragSource,
  flippedProps: object,
  isDragging: boolean,
}

export interface DroppableBoxRenderProps {
  childRefs: Ref<HTMLElement>[],
  drop: ConnectDropTarget,
  items: ItemWithId[],
}

// TODO: Find this in react-dnd
export interface DropItem {
  id: number | string,
  index: number,
}

export interface ItemWithId {
  id: number | string,
  [key: string]: unknown,
}

export interface MouseInfo {
  isInside?: boolean,
  dist?: number;
  hoverIdx?: number;
  side?: string;
}