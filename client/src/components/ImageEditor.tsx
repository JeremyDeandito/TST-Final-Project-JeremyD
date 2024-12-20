import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import './ImageEditor.css';

// Initialize Firebase services
const storage = getStorage(app);
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

  const uploadImage = async (file: File, path: string): Promise<string> => {
    try {
      const metadata = {
        contentType: file.type,
      };
      
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
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

      // Convert base64 to Blob
      const inputBlob = await fetch(inputImage).then(r => r.blob());
      const referenceBlob = await fetch(referenceImage).then(r => r.blob());

      // Create File objects
      const inputFile = new File([inputBlob], inputFileName, { type: 'image/jpeg' });
      const referenceFile = new File([referenceBlob], referenceFileName, { type: 'image/jpeg' });

      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const timestamp = Date.now();
      
      // Upload images and get URLs
      const [inputUrl, referenceUrl] = await Promise.all([
        uploadImage(inputFile, `images/${userId}/input_${timestamp}.jpg`),
        uploadImage(referenceFile, `images/${userId}/reference_${timestamp}.jpg`)
      ]);

      // Make API call to your backend
      const response = await fetch(`${BACKEND_URL}/edit-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        },
        body: JSON.stringify({
          inputImageUrl: inputUrl,
          referenceImageUrl: referenceUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process images');
      }

      const result = await response.json();
      if (result.processedImageUrl) {
        setProcessedImage(result.processedImageUrl);
      } else {
        throw new Error('No processed image URL received');
      }

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;

