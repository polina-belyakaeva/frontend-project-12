import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ROUTES } from './utils/routes.js';
import Header from './components/Header';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => (
  <div className="d-flex flex-column vh-100 bg-light">
    <Header />
    <ToastContainer />
    <Routes>
      <Route path={ROUTES.home} element={<Home />} />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.signup} element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default App;
