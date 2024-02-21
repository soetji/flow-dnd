import { FC } from 'react';
import Items from './Items';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css';

const App: FC = () => {
  return (
    <DndProvider backend={HTML5Backend} >
      <p>Reorder</p>
      <Items />
    </DndProvider>
  );
};

export default App;