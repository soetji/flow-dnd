import { MutableRefObject, Ref, RefObject } from 'react';
// import { ConnectDropTarget } from 'react-dnd';

export type ItemId = number | string;
export type GroupId = number | string;

export interface DraggableRenderProps<InnerElementType> {
  canDrag: boolean,
  dragClassName: string,
  dragProps: object,
  innerElementRef: MutableRefObject<InnerElementType>,
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
  onDragEnd: (ev: DragEvent) => void,
  onDragEnter: (ev: DragEvent) => void,
  onDragLeave: (ev: DragEvent) => void,
  onDragStart: (ev: DragEvent) => void,
}

export interface DroppableBoxRenderProps {
  draggableRefByIndex: (index: number) => Ref<DraggableHandle>, 
  droppableRef: RefObject<HTMLElement>,
  droppableProps: HTMLDroppableProps,
  items: ItemWithId[],
}

export interface OnDropInfo {
  fromId: ItemId,
  fromItems: ItemWithId[],
  toId: ItemId,
  toItems: ItemWithId[],
}

export interface DroppableProps {
  accept: string,
  canDragInOut?: boolean,
  // fixedItemIds: ItemId[], // TODO
  items: ItemWithId[],
  onDragEnd?: (removedId?: ItemId | null, items?: ItemWithId[]) => void,
  onDragEnter?: (item?: ItemWithId, newItems?: ItemWithId[]) => void,
  onDragLeave?: (id?: ItemId, newItems?: ItemWithId[]) => void,
  onDragStart?: () => void,
  onDrop?: (info: OnDropInfo) => void,
}

export interface DroppableBoxProps extends DroppableProps {
  children: (props: DroppableBoxRenderProps) => JSX.Element,
}

export interface UseDropBoxProps extends DroppableProps {
  moving: boolean,
}

export interface DndItem {
  id: ItemId,
  currentBoxEl: HTMLElement,
  index: number,
  itemToCopy?: ItemWithId,
  setStartBoxInfo?: (info: object) => void,
  type: 'string',
}

export interface MouseInfo {
  isInside?: boolean,
  dist?: number;
  hoverIdx?: number;
  side?: string;
}