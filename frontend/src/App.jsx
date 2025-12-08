import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import VerifyCode from "./pages/auth/VerifyCode.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ResetSuccess from "./pages/auth/ResetSuccess.jsx";

function App() {
  return (
    <Routes>

      {/* Default route – for now go to /register */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Auth pages route */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

    </Routes>
  )
}

export default App;
