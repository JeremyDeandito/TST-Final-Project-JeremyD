import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import defaultProfilePic from '../assets/defaultProfile.png';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string>(auth.currentUser?.photoURL || defaultProfilePic);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock data for saved images - replace with actual data from your backend
  const savedImages = [
    { id: 1, url: '/path/to/image1.jpg' },
    { id: 2, url: '/path/to/image2.jpg' },
    { id: 3, url: '/path/to/image3.jpg' },
    // Add more images as needed
  ];

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Implement your image upload logic here
      // Update profile picture in Firebase
    }
  };

  const handleChangePassword = () => {
    // Implement password change logic
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = document.querySelector('.carousel-content');
    if (carousel) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Your Profile</h1>

        <div className="profile-picture-section">
          <div className="profile-picture">
            <img src={profilePic} alt="Profile" />
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            accept="image/*"
            hidden
          />
          
          <button 
            className="change-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Profile Picture
          </button>
          
          <button 
            className="change-button"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>

        <div className="saved-images-section">
          <h2>Your saved images:</h2>
          
          <div className="carousel-container">
            <button 
              className="carousel-button left"
              onClick={() => scrollCarousel('left')}
            >
              &#8249;
            </button>
            
            <div className="carousel-content">
              {savedImages.map((image) => (
                <div key={image.id} className="carousel-item">
                  <img src={image.url} alt="Saved work" />
                </div>
              ))}
            </div>
            
            <button 
              className="carousel-button right"
              onClick={() => scrollCarousel('right')}
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

