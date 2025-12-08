import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';

function App() {
  return (
    <Routes>

      {/* Default route – for now go to /register */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Auth pages route */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  )
}

export default App;
