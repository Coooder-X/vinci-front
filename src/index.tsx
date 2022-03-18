import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './page/Login';
import Register from './page/Register';
import Menu from './page/Menu';
import Test from './page/test';
import { Route, HashRouter, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from './model';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter basename="" >
      {/* <React.StrictMode> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      {/* </React.StrictMode> */}
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
reportWebVitals();
