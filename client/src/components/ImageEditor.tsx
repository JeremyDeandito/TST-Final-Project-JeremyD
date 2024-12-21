import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import './ImageEditor.css';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Initialize Firebase auth
const auth = getAuth(app);

const BACKEND_URL = 'https://tst-final-project-jeremyd-production.up.railway.app';

const ImageEditor: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [inputFileName, setInputFileName] = useState<string>('');
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setInputFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setInputImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setReferenceImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async () => {
    if (!inputImage || !referenceImage) {
      setError('Please select both images');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const inputBlob = await fetch(inputImage).then(r => r.blob());
      const referenceBlob = await fetch(referenceImage).then(r => r.blob());

      const formData = new FormData();
      formData.append('inputImage', inputBlob, inputFileName);
      formData.append('referenceImage', referenceBlob, referenceFileName);

      const token = await auth.currentUser?.getIdToken();

      const response = await fetch(`${BACKEND_URL}/edit-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        mode: 'cors',
        credentials: 'include',
        body: formData
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Server result:', result);

      if (result.processedImageUrl) {
        setProcessedImage(result.processedImageUrl);
      } else {
        throw new Error('No processed image URL received');
      }

    } catch (error) {
      console.error('Detailed error:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditedImage = async (editedImageUrl: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Save to Firestore
      await addDoc(collection(db, 'editedImages'), {
        userId,
        editedImageUrl,
        timestamp: serverTimestamp()
      });

      // Show success message
      setSuccess(true);
    } catch (error) {
      console.error('Error saving image:', error);
      setError('Failed to save image. Please try again.');
    }
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'edited-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="editor-container">
      <div className="editor-card">
        <h1>Color Match</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="image-upload-container">
          <div className="upload-section">
            <h2>Input Image</h2>
            <div className="file-upload">
              <label className="choose-file-btn">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputImageChange}
                  hidden
                />
              </label>
              <span className="filename">{inputFileName}</span>
            </div>
            <div className="image-preview">
              {inputImage && <img src={inputImage} alt="Input preview" />}
            </div>
          </div>

          <div className="divider" />

          <div className="upload-section">
            <h2>Reference Image</h2>
            <div className="file-upload">
              <label className="choose-file-btn">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReferenceImageChange}
                  hidden
                />
              </label>
              <span className="filename">{referenceFileName}</span>
            </div>
            <div className="image-preview">
              {referenceImage && <img src={referenceImage} alt="Reference preview" />}
            </div>
          </div>
        </div>

        <button 
          className="edit-image-btn"
          onClick={handleEditImage}
          disabled={!inputImage || !referenceImage || loading}
        >
          {loading ? 'Processing...' : 'Edit Image'}
        </button>

        {processedImage && (
          <div className="processed-image-section">
            <h2>Processed Image</h2>
            <div className="image-preview">
              <img src={processedImage} alt="Processed result" />
            </div>
            <button 
              className="save-image-btn"
              onClick={() => handleSaveEditedImage(processedImage)}
              disabled={!processedImage}
            >
              Save Image
            </button>
            <button 
              className="download-image-btn"
              onClick={() => downloadImage(processedImage)}
              disabled={!processedImage}
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;

