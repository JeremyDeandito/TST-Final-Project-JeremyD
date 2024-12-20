import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Landing.css';
import logo from '../assets/Logo.png';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="logo">
          <img src={logo} alt="Chroma Logo" />
        </div>
        
        <h2>Seamlessly Align Your Colors</h2>
        <p>
          Upload your image and a reference photo, and Chroma will adjust
          the colors of your image to match the tones and mood of the
          reference effortlessly.
        </p>
        
        <button 
          className="edit-now-btn"
          onClick={() => navigate('/login')}
        >
          Edit Now
        </button>
      </div>
    </div>
  );
};

export default Landing;
