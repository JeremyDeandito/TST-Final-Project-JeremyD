import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import ImageEditor from './components/ImageEditor';
import './App.css';

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Router basename="/TST-Final-Project-JeremyD">
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={
            !currentUser ? <Landing /> : <Navigate to="/editor" />
          } />
          <Route path="/login" element={
            !currentUser ? <Login /> : <Navigate to="/editor" />
          } />
          <Route path="/signup" element={
            !currentUser ? <SignUp /> : <Navigate to="/editor" />
          } />
          <Route path="/profile" element={
            currentUser ? <Profile /> : <Navigate to="/login" />
          } />
          <Route path="/editor" element={
            currentUser ? <ImageEditor /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

