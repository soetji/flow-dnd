import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const Container = React.StrictMode;
// const Container = React.Fragment;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Container>
    <App />
  </Container>,
)
