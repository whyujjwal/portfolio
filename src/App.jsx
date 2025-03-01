import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import DesktopOS from './components/OS/DesktopOS';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <DesktopOS />
      </div>
    </Provider>
  );
}

export default App;
