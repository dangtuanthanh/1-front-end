// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Custom CSS for styling
// Lazy load các trang
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MessagingPage = lazy(() => import('./pages//MessagingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  
  return (
    <Router>
      <Suspense fallback={<div>Vui lòng chờ...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/rooms" element={<MessagingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
