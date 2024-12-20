import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ImageEditor from './components/ImageEditor';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import Landing from './components/Landing';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<PrivateRoute element={<Landing />} />} />
            <Route path="/editor" element={<PrivateRoute element={<ImageEditor />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

