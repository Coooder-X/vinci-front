import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './page/Login';
import Register from './page/Register';
import Menu from './page/Menu';
import { Route, HashRouter, Routes } from 'react-router-dom';

ReactDOM.render(
  <HashRouter basename="" >
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </React.StrictMode>
  </HashRouter>,
  document.getElementById('root')
);
reportWebVitals();
