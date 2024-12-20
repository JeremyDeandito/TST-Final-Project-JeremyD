import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Navigation.css';
import logo from '../assets/Logo.png';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Chroma" />
        </Link>
        
        <div className="nav-buttons">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <Link to="/profile" className="profile-btn">
            <div className="profile-icon">
              <img 
                src={auth.currentUser?.photoURL || '/defaultProfile.png'} 
                alt="Profile" 
              />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;