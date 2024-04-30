import { ItemWithId } from './types';

export const getIds = (items: ItemWithId[]) => items.map(it => it.id);