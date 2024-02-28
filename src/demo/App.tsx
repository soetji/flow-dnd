import React, { FC } from 'react';
import DndProvider from '../DndProvider';
import Items from './Items';
import './App.css';

const App: FC = () => {
  return (
    <DndProvider>
      <p>Reorder</p>
      <Items />
    </DndProvider>
  );
};

export default App;