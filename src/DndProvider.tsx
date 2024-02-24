import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// eslint-disable-next-line react-refresh/only-export-components
export default ({ children }: {children: JSX.Element | JSX.Element[]}) => (
  <DndProvider backend={HTML5Backend} >
    {children}
  </DndProvider>
);