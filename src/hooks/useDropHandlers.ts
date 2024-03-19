import { useDragDropManager } from 'react-dnd';
import { noop } from 'lodash';
import { BoxInfo, ItemWithId, UseDropHandlersProps } from '../types';

// const getIds = (items: ItemWithId[]) => items.map(it => it.id);

export function useDropHandlers({
  accept,
  boxInfoRef,
  canDragInOut,
  canHover,
  items,
  setItemsAndPrev,
  setShowOrigDragEl,
  onDragEnd = noop,
  onDragEnter = noop,
  onDragLeave = noop,
  onDragStart = noop,
}: UseDropHandlersProps) {
  const dragDropManager = useDragDropManager();

  const setStartBoxInfo = (info: object) =>
    boxInfoRef.current = { ...boxInfoRef.current, ...info };

  const _onDragStart = (ev: DragEvent) => {
    const boxEl = ev.currentTarget;
    boxInfoRef.current = {
      boxEl,
      dragEl: ev.target,
      dropBoxEl: boxEl,
    } as BoxInfo;
    setShowOrigDragEl(true);
    onDragStart();
    
    setTimeout(() => {
      const dndItm = dragDropManager.getMonitor().getItem();
      dndItm.currentBoxEl = boxEl;
      dndItm.itemToCopy = items[dndItm.index];
      dndItm.setStartBoxInfo = setStartBoxInfo;
      dndItm.startBoxEl = boxEl;

      boxInfoRef.current = {
        ...boxInfoRef.current,
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
        canHover.current = false;

        // Drag el is from box
        if (boxInfoRef.current.dragEl) {
          setShowOrigDragEl(true);
          dndItm.index = boxInfoRef.current.itemLeaveIndex;
          // addToEndInfo(dndItm.id, items, endInfoRef.current);
        } else {
          const newItem = dndItm.itemToCopy as ItemWithId;
          const newItems = [...items, newItem];
          // addToEndInfo(dndItm.id, newItems, endInfoRef.current);
          setItemsAndPrev(newItems);
          onDragEnter(newItem, newItems);
        }
      }
    } else {
      onDragEnter();
    }
  }

  const _onDragLeave = (ev: DragEvent) => {
    if (canDragInOut) {
      const dndItm = dragDropManager.getMonitor().getItem();
      // console.log('_onDragLeave?', items, ev.currentTarget, ev.target, ev.relatedTarget);
      
      if (dndItm.type === accept &&
        // Left to an existing element
        (ev.relatedTarget as HTMLElement).isConnected &&
        (ev.currentTarget as HTMLElement).contains(ev.target as HTMLElement) &&
        // Left to an element outside the box
        ev.currentTarget !== ev.relatedTarget &&
        !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
      ) {
        // console.log('_onDragLeave', items, ev.currentTarget, ev.target, ev.relatedTarget);
        dndItm.setStartBoxInfo({ dropBoxEl: dndItm.startBoxEl });
        canHover.current = false;
        
        // Drag el is from box
        if (boxInfoRef.current.dragEl) {
          setShowOrigDragEl(false);
          dndItm.setStartBoxInfo = setStartBoxInfo;
          boxInfoRef.current.itemLeaveIndex = dndItm.index;
          // console.log('_onDragLeave', boxInfoRef.current.itemLeaveIndex);
        } else {
          const newItems = items.toSpliced(dndItm.index, 1);
          // removeFromEndInfo(dndItm.id, newItems, endInfoRef.current);
          setItemsAndPrev(newItems);
          // console.log('onDragLeave', dndItm.id, newItems);
          onDragLeave(dndItm.id, newItems);
        }
      }
    } else {
      onDragLeave();
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