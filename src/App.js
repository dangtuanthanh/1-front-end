// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Custom CSS for styling
// Lazy load các trang
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RoomsPage = lazy(() => import('./pages//MessagingPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  
  return (
    <Router>
      <Suspense fallback={<div>Vui lòng chờ...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
