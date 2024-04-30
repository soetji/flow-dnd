import { useEffect, useState } from 'react';
import { useDragDropManager } from 'react-dnd';
import { noop } from 'lodash';

import { StartBoxInfo, ItemWithId, UseDropHandlersProps } from '../types';
import { getDragStartEl } from './utils';
import { getIds } from '../utils';
import styles from './styles.module.css';

export default function useDropBoxHandlers({
  accept,
  canDragInOut,
  canHoverRef,
  items,
  setItemsAndPrev,
  startBoxInfoRef,
  onDragEnd = noop,
  onDragEnter = noop,
  onDragLeave = noop,
  onDragStart = noop,
}: UseDropHandlersProps) {
  const [showStartDragEl, setShowStartDragEl] = useState(true);
  const [dragging, setDragging] = useState(false);
  const dragDropManager = useDragDropManager();

  useEffect(() => {
    startBoxInfoRef.current?.dragStartEl?.classList[showStartDragEl ? 'remove' : 'add'](styles.hidden);
    // Restore hover after enter and leave events in the orig drag box
    canHoverRef.current = true;
    // console.log('showStartDragEl canHoverRef', true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStartDragEl]);

  const setStartBoxInfo = (info: object) =>
    startBoxInfoRef.current = { ...startBoxInfoRef.current, ...info };

  const _onDragStart = (ev: DragEvent) => {
    const boxEl = ev.currentTarget as HTMLElement;
    const dragEl = ev.target as HTMLElement;
    canHoverRef.current = true;
    // console.log('start canHoverRef', true);
    
    startBoxInfoRef.current = {
      boxEl,
      dragStartEl: getDragStartEl(dragEl) as HTMLElement,
      enteredBoxEl: boxEl,
    };
    setShowStartDragEl(true);
    onDragStart();
    setDragging(true);
    
    // Delay until dragDropManager becomes active.
    // Can't use useEffect(). dragDropManager still inactive in useEffect().
    setTimeout(() => {
      const dndItm = dragDropManager.getMonitor().getItem();
      dndItm.enteredBoxEl = boxEl;
      dndItm.itemToCopy = items[dndItm.index];
      dndItm.setStartBoxInfo = setStartBoxInfo;
      dndItm.startBoxEl = boxEl;

      startBoxInfoRef.current = {
        ...startBoxInfoRef.current,
        itemId: dndItm.id,
        itemLeaveIndex: dndItm.index,
      } as StartBoxInfo;
    });
  };

  const _onDragEnter = (ev: DragEvent) => {
    if (canDragInOut) {
      ev.preventDefault();
      const dndItm = dragDropManager.getMonitor().getItem();
      // console.log('_onDragEnter?', getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
  
      // ev.currentTarget is entered box
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

        const go = () => {
          if (dndItm.enteredBoxEl !== ev.currentTarget) dndItm.leave();
          dndItm.setStartBoxInfo({ enteredBoxEl: ev.currentTarget });
          dndItm.enteredBoxEl = ev.currentTarget;
        }

        if (startBoxInfoRef.current === null) {
          if (!getIds(items).includes(dndItm.itemToCopy.id)) {
            const boxRect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
            const enterFromTop = ev.clientY <= ((boxRect.top + boxRect.bottom) /2 );
            const newItem = dndItm.itemToCopy as ItemWithId;
            const newItems = enterFromTop ?
              [newItem, ...items] : [...items, newItem];
            // const [newIdx, newItems] = enterFromTop ?
            //   [0, [newItem, ...items]] : [items.length, [...items, newItem]];
            // dndItm.index = newIdx;
            // console.log('_onDragEnter non-orig box', newItem, getIds(newItems), ev.currentTarget, ev.target, ev.relatedTarget)
            setItemsAndPrev(newItems);
            onDragEnter(newItem, newItems);
            canHoverRef.current = false;
            // console.log('enter canHoverRef', false);
            go();
          }
        } else {
          if (!showStartDragEl) setShowStartDragEl(true);
          dndItm.index = startBoxInfoRef.current.itemLeaveIndex;
          console.log('_onDragEnter orig box', dndItm.index, ev.currentTarget, ev.target, ev.relatedTarget)
          go();
        }

      }
    }
  }

  const _onDragLeave = (ev: DragEvent) => {
    if (canDragInOut) {
      const dndItm = dragDropManager.getMonitor().getItem();
      // console.log('_onDragLeave?', getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
      
      // ev.currentTarget is box left
      if (dndItm.type === accept &&
        ev.relatedTarget !== null && // Why?
        // Left to an existing element
        (ev.relatedTarget as HTMLElement).isConnected &&
        (ev.currentTarget as HTMLElement).contains(ev.target as HTMLElement) &&
        // Left to an element outside the box
        ev.currentTarget !== ev.relatedTarget &&
        !(ev.currentTarget as HTMLElement).contains(ev.relatedTarget as HTMLElement)
      ) {
        // console.log('_onDragLeave', getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
        // dndItm.setStartBoxInfo({ enteredBoxEl: dndItm.startBoxEl });
        
        if (startBoxInfoRef.current === null) {
          // console.log('_onDragLeave non-orig box', dndItm.id, getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
          dndItm.leave = () => {
            canHoverRef.current = false;
            // console.log('leave non-orig box canHoverRef', false);
            
            const idxToRemove = items.findIndex(it => it.id === dndItm.id);
            if (idxToRemove !== -1) {
              const newItems = items.toSpliced(idxToRemove, 1);
              setItemsAndPrev(newItems);
              onDragLeave(dndItm.id, newItems);
            }
          }
        } else {
          // console.log('_onDragLeave orig box', startBoxInfoRef.current.itemLeaveIndex, getIds(items), ev.currentTarget, ev.target, ev.relatedTarget);
          dndItm.leave = () => {
            canHoverRef.current = false;
            // console.log('leave orig box canHoverRef', false);
            setShowStartDragEl(false);
            startBoxInfoRef.current &&
              (startBoxInfoRef.current.itemLeaveIndex = dndItm.index);
          }
        }
      }
    }
  };

  const _onDragEnd = (ev: DragEvent) => {
    if (startBoxInfoRef.current) {
      // dragDropManager returns null here
      // ev.target is the original drag el
      // ev.currentTarget is the original box
      // console.log('_onDragEnd', getIds(items), startBoxInfoRef.current.enteredBoxEl, ev.currentTarget)
  
      if (startBoxInfoRef.current.enteredBoxEl === ev.currentTarget) {
        onDragEnd(items);
      } else {
        const newItems = items.toSpliced(startBoxInfoRef.current.itemLeaveIndex as number, 1);
        // console.log('_onDragEnd', startBoxInfoRef.current.itemLeaveIndex, getIds(items), getIds(newItems));
  
        // removeFromEndInfo(startBoxInfoRef.current.itemId as ItemId, newItems, endInfoRef.current);
        startBoxInfoRef.current.dragCurrEl?.classList.remove(styles.dragging);
        setItemsAndPrev(newItems);
        onDragEnd(newItems, startBoxInfoRef.current.itemId);
      }

      startBoxInfoRef.current = null;
      setDragging(false);
    }
  };

  return {
    dragging,
    _onDragStart,
    _onDragEnter,
    _onDragLeave,
    _onDragEnd,
  }
}