import { Ref } from 'react';
import { ConnectDropTarget } from 'react-dnd';

export interface ItemWithId {
  id: number | string,
  [key: string]: unknown,
}

export interface DraggableHandle {
  getDOMElement: () => HTMLElement,
}

export interface DroppableBoxRenderProps {
  draggablesRef: Ref<DraggableHandle[]>, 
  drop: ConnectDropTarget,
  items: ItemWithId[],
}

export interface DraggableRenderProps<InnerElementType> {
  canDrag: boolean,
  flippedProps: object,
  innerElementRef: Ref<InnerElementType>,
  isDragging: boolean,
}

// TODO: Find this in react-dnd
export interface DragItem {
  id: number | string,
  index: number,
}

export interface MouseInfo {
  isInside?: boolean,
  dist?: number;
  hoverIdx?: number;
  side?: string;
}