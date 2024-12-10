import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ImageEditor() {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setInputImage(file);
    }
  }, []);

  const handleReferenceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
    }
  }, []);

  const handleEdit = async () => {
    if (!inputImage || !referenceImage) {
      alert('Please select both input and reference images.');
      return;
    }

    const formData = new FormData();
    formData.append('input', inputImage);
    formData.append('reference', referenceImage);

    try {
      const response = await fetch('http://localhost:3001/edit-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to edit image');
      }

      const blob = await response.blob();
      const editedImageUrl = URL.createObjectURL(blob);
      setEditedImage(editedImageUrl);

      // Save edited image to Firestore
      if (currentUser) {
        await addDoc(collection(db, 'editedImages'), {
          userId: currentUser.uid,
          url: editedImageUrl,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error editing image:', error);
      alert('Error editing image. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4">Image Editor</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input-image">
            Input Image
          </label>
          <input
            id="input-image"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reference-image">
            Reference Image
          </label>
          <input
            id="reference-image"
            type="file"
            accept="image/*"
            onChange={handleReferenceChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          onClick={handleEdit}
          disabled={!inputImage || !referenceImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Image
        </button>
        {editedImage && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Edited Image:</h3>
            <img src={editedImage} alt="Edited" className="max-w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

