import { useDragDropManager } from 'react-dnd';
import { noop } from 'lodash';
import { BoxInfo, ItemWithId, UseDropHandlersProps } from '../types';

// const getIds = (items: ItemWithId[]) => items.map(it => it.id);
import styles from './styles.module.css';

export default function useDropHandlers({
  accept,
  boxInfoRef,
  canDragInOut,
  canHoverRef,
  items,
  setItemsAndPrev,
  setShowDragPreviewSrcEl,
  onDragEnd = noop,
  onDragEnter = noop,
  onDragLeave = noop,
  onDragStart = noop,
}: UseDropHandlersProps) {
  const dragDropManager = useDragDropManager();

  const setStartBoxInfo = (info: object) =>
    boxInfoRef.current = { ...boxInfoRef.current, ...info };

  const _onDragStart = (ev: DragEvent) => {
    const boxEl = ev.currentTarget as HTMLElement;
    const dragEl = ev.target as HTMLElement;
    boxInfoRef.current = {
      boxEl,
      dropBoxEl: boxEl,
    };
    setShowDragPreviewSrcEl(true);
    onDragStart();
    
    setTimeout(() => {
      const dndItm = dragDropManager.getMonitor().getItem();
      dndItm.currentBoxEl = boxEl;
      dndItm.itemToCopy = items[dndItm.index];
      dndItm.setStartBoxInfo = setStartBoxInfo;
      dndItm.startBoxEl = boxEl;

      boxInfoRef.current = {
        ...boxInfoRef.current,
        dragPreviewSrcEl: dragEl.closest(`.${styles.dragging}`),
        itemId: dndItm.id,
        itemLeaveIndex: dndItm.index,
      } as BoxInfo;
      // console.log('_onDragStart', boxInfoRef.current.itemLeaveIndex, getIds(items));

    });
  };

  const _onDragEnter = (ev: DragEvent) => {
    if (canDragInOut) {
      ev.preventDefault();
      const dndItm = dragDropManager.getMonitor().getItem();
      // console.log('_onDragEnter?', getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
  
      if (dndItm.type === accept &&
        ev.relatedTarget !== null && // Why is it null in the beginning of drag?
        // Entered from an existing element. The from element can
        // drop off dom; e.g., loading or skeletons
        (ev.relatedTarget as HTMLElement).isConnected &&
        // Entered to an element inside box
        (ev.currentTarget as HTMLElement).contains(ev.target as HTMLElement) &&
        // Entered from an element outside box
        ev.currentTarget !== ev.relatedTarget &&
        !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
      ) {
        // console.log('_onDragEnter', getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
        dndItm.setStartBoxInfo({ dropBoxEl: ev.currentTarget });
        dndItm.currentBoxEl = ev.currentTarget;
        canHoverRef.current = false;

        // Drag el is from box
        if (boxInfoRef.current.dragPreviewSrcEl) {
          setShowDragPreviewSrcEl(true);
          dndItm.index = boxInfoRef.current.itemLeaveIndex;
          // console.log('_onDragEnter index', dndItm.index)
        } else {
          const newItem = dndItm.itemToCopy as ItemWithId;
          // console.log('_onDragEnter newItem', newItem)
          const newItems = [...items, newItem];
          setItemsAndPrev(newItems);
          onDragEnter(newItem, newItems);
        }
      }
    }
  }

  const _onDragLeave = (ev: DragEvent) => {
    if (canDragInOut) {
      const dndItm = dragDropManager.getMonitor().getItem();
      // console.log('_onDragLeave?', getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
      
      if (dndItm.type === accept &&
        // Left to an existing element
        (ev.relatedTarget as HTMLElement).isConnected &&
        (ev.currentTarget as HTMLElement).contains(ev.target as HTMLElement) &&
        // Left to an element outside the box
        ev.currentTarget !== ev.relatedTarget &&
        !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
      ) {
        // console.log('_onDragLeave', getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
        dndItm.setStartBoxInfo({ dropBoxEl: dndItm.startBoxEl });
        canHoverRef.current = false;
        
        // Drag el is from box
        if (boxInfoRef.current.dragPreviewSrcEl) {
          setShowDragPreviewSrcEl(false);
          dndItm.setStartBoxInfo = setStartBoxInfo;
          boxInfoRef.current.itemLeaveIndex = dndItm.index;
          // console.log('_onDragLeave in box', boxInfoRef.current.itemLeaveIndex);
        } else {
          const newItems = items.toSpliced(dndItm.index, 1);
          setItemsAndPrev(newItems);
          // console.log('_onDragLeave out box', dndItm.id, newItems);
          onDragLeave(dndItm.id, newItems);
        }
      }
    }
  };

  const _onDragEnd = (ev: DragEvent) => {
    // dragDropManager returns null here
    // ev.target is the original drag el
    // ev.currentTarget is the original box
    // console.log('_onDragEnd', items, boxInfoRef.current.dropBoxEl, ev.currentTarget);
    if (boxInfoRef.current.dropBoxEl === ev.currentTarget) {
      onDragEnd(null, items);
    } else {
      const newItems = items.toSpliced(boxInfoRef.current.itemLeaveIndex as number, 1);
      // console.log('_onDragEnd', boxInfoRef.current.itemLeaveIndex, getIds(items), getIds(newItems));

      // removeFromEndInfo(boxInfoRef.current.itemId as ItemId, newItems, endInfoRef.current);
      setItemsAndPrev(newItems);
      onDragEnd(boxInfoRef.current.itemId, newItems);
    }
    boxInfoRef.current = {};
  };

  return {
    _onDragStart,
    _onDragEnter,
    _onDragLeave,
    _onDragEnd,
  }
}