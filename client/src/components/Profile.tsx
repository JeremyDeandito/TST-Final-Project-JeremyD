import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data for saved images - replace with actual data from your backend
  const savedImages = [
    { id: 1, url: '/path/to/image1.jpg' },
    { id: 2, url: '/path/to/image2.jpg' },
    { id: 3, url: '/path/to/image3.jpg' },
    // Add more images as needed
  ];

  const handleChangePassword = () => {
    // Implement password change logic
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2>Your Profile</h2>
        
        <div className="settings-section">
          <button onClick={handleChangePassword}>
            Change Password
          </button>
        </div>

        <div className="saved-images-section">
          <h3>Saved Images</h3>
          <div className="image-grid">
            {savedImages.map(image => (
              <div key={image.id} className="image-item">
                <img src={image.url} alt={`Saved image ${image.id}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

