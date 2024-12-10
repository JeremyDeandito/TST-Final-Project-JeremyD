import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navigation: React.FC = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        </li>
        {currentUser ? (
          <>
            <li>
              <Link to="/profile" className="text-white hover:text-gray-300">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;