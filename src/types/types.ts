import { MutableRefObject, Ref, RefObject } from 'react';
// import { ConnectDropTarget, ConnectDragSource } from 'react-dnd';
import { ConnectDragPreview  } from 'react-dnd';

export type ItemId = number | string;
export type GroupId = number | string;

export interface DraggableRenderProps<dragElementType> {
  canDrag?: boolean,
  dragClassName: string,
  dragHandleRef: MutableRefObject<dragElementType>,
  dragProps: object,
  dragging: boolean,
  previewConnect: ConnectDragPreview,
}

interface _DraggableProps {
  canDrag?: boolean,
  id: ItemId,
  index: number,
  type: string,
}

export interface DraggableProps<dragElementType> extends _DraggableProps {
  children: (props: DraggableRenderProps<dragElementType>) => JSX.Element,
  draggableRef: Ref<DraggableImpHandle>,
}

export interface UseDragProps extends _DraggableProps {
}

export interface ItemWithId {
  id: ItemId,
  [key: string]: unknown,
}

export interface DraggableImpHandle {
  getDOMElement: () => HTMLElement | null,
  getId: () => ItemId,
}

export interface HTMLDroppableProps {
  onDragEnd: (ev: DragEvent) => void,
  onDragEnter: (ev: DragEvent) => void,
  onDragLeave: (ev: DragEvent) => void,
  onDragStart: (ev: DragEvent) => void,
}

export interface DroppableBoxRenderProps {
  draggableRefByIndex: (index: number) => Ref<DraggableImpHandle>, 
  droppableRef: RefObject<HTMLElement>,
  droppableProps: HTMLDroppableProps | object,
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
  onDragEnd?: (items?: ItemWithId[], removedId?: ItemId | null) => void,
  onDragEnter?: (item?: ItemWithId, newItems?: ItemWithId[]) => void,
  onDragLeave?: (id?: ItemId, newItems?: ItemWithId[]) => void,
  onDragStart?: () => void,
  onDrop?: (info: OnDropInfo) => void,
}

export interface DroppableBoxProps extends DroppableProps {
  canDrop?: boolean,
  children: (props: DroppableBoxRenderProps) => JSX.Element,
}

export interface UseDropBoxProps extends DroppableProps {
  canDrop?: boolean,
  draggableImpsRef: MutableRefObject<DraggableImpHandle[]>,
  moving: boolean,
}

export interface UseDropProps {
  accept: string,
  boxRef: RefObject<HTMLElement>,
  canDrop: boolean,
  canHoverRef: MutableRefObject<boolean>,
  defaultItems: ItemWithId[],
  draggableImpsRef: MutableRefObject<DraggableImpHandle[]>,
  // fixedItemIds,
  items: ItemWithId[],
  moving: boolean,
  setItemsAndPrev: (items: ItemWithId[]) => void,
  toIdRef: MutableRefObject<ItemId>,
  onDrop?: (info: OnDropInfo) => void,
}

export interface StartBoxInfo {
  boxEl: HTMLElement,
  dragCurrEl: HTMLElement,
  dragStartEl: HTMLElement,
  enteredBoxEl: HTMLElement,
  itemId: ItemId,
  itemLeaveIndex: number,
}

export interface UseDropHandlersProps extends DroppableProps {
  canHoverRef: MutableRefObject<boolean>,
  setItemsAndPrev: (items: ItemWithId[]) => void,
  startBoxInfoRef: MutableRefObject<Partial<StartBoxInfo | null>>,
}

export interface DndItem {
  id: ItemId,
  enteredBoxEl: HTMLElement,
  index: number,
  itemToCopy?: ItemWithId,
  setStartBoxInfo?: (info: object) => void,
  type: 'string',
}

export interface MouseInfo {
  dist?: number;
  hoverIdx?: number;
  isInside?: boolean,
  sideToGo?: string;
}