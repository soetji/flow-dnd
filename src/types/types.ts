import { Ref } from 'react';
import { ConnectDropTarget } from 'react-dnd';

export interface ItemWithId {
  id: number | string,
  [key: string]: unknown,
}

export interface DraggableHandle {
  getDOMElement: () => HTMLElement,
}

export interface HTMLDroppableProps {
  onDragEnd?: () => void,
  onDragStart?: () => void,
}

export interface DroppableBoxRenderProps {
  draggableRefByIndex: (index: number) => Ref<DraggableHandle>, 
  droppableProps: HTMLDroppableProps,
  drop: ConnectDropTarget,
  items: ItemWithId[],
}

export interface DroppableBoxProps extends HTMLDroppableProps {
  accept: string,
  children: (props: DroppableBoxRenderProps) => JSX.Element,
  items: ItemWithId[],
  onDrop?: (items: ItemWithId[]) => void,
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