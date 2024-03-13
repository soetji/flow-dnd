import { Ref } from 'react';
import { ConnectDropTarget } from 'react-dnd';

export type ItemId = number | string;
export type GroupId = number | string;

export interface DraggableRenderProps<InnerElementType> {
  canDrag: boolean,
  dragClassName: string,
  dragProps: object,
  innerElementRef: Ref<InnerElementType>,
  dragging: boolean,
}

interface _DraggableProps {
  canDrag?: boolean,
  id: ItemId,
  index: number,
  type: string,
}

export interface DraggableProps<InnerElementType> extends _DraggableProps {
  children: (props: DraggableRenderProps<InnerElementType>) => JSX.Element,
  draggableRef: Ref<DraggableHandle>,
}

export interface UseDragProps extends _DraggableProps {
}

export interface ItemWithId {
  id: ItemId,
  [key: string]: unknown,
}

export interface DraggableHandle {
  getDOMElement: () => HTMLElement,
  getId: () => ItemId,
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

interface OnDropInfo {
  fromId: ItemId,
  fromItems: ItemWithId[],
  toId: ItemId,
  toItems: ItemWithId[],
}

interface DroppableProps {
  accept: string,
  canDragInOut?: boolean,
  // fixedItemIds: ItemId[], // TODO
  items: ItemWithId[],
  onDragEnd?: () => void,
  onDragEnter?: (item?: ItemWithId, newItems?: ItemWithId[]) => void,
  onDragLeave?: (id?: ItemId, newItems?: ItemWithId[]) => void,
  onDragStart?: () => void,
  onDrop?: (info: OnDropInfo) => void,
}

export interface DroppableBoxProps extends DroppableProps, HTMLDroppableProps {
  children: (props: DroppableBoxRenderProps) => JSX.Element,
}

export interface UseDropBoxProps extends DroppableProps {
  moving: boolean,
}

export interface DndItem {
  id: ItemId,
  index: number,
  itemToDragEnter?: ItemWithId,
  type: 'string',
}

export interface MouseInfo {
  isInside?: boolean,
  dist?: number;
  hoverIdx?: number;
  side?: string;
}