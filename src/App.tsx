import React from 'react';
import useCheckAuth from './hooks/useCheckAuth';
import Routes from "./routes"
import './index.less';

function App() {

  useCheckAuth();
  return (
    <>
      <Routes />
    </>
  );
}

export default App;
