import React, { useEffect, useState } from 'react';
import { uploadProfilePicture, getProfilePictureUrl } from '../../utils/StorageService';
import './ProfilePicUploader.css';

const ProfilePicUploader = ({ userId }) => {
  const [imageURL, setImageURL] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(null);

  const loadProfilePic = async () => {
    try {
      const url = await getProfilePictureUrl(userId);
      setImageURL(url);
    } catch (err) {
      console.warn('[S3] No profile picture found');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageLoading(true);
    setImageLoadError(null);

    try {
      await uploadProfilePicture(file, userId);
      await loadProfilePic();
    } catch (err) {
      console.error('[S3] Upload failed:', err);
      setImageLoadError('Failed to upload image');
    } finally {
      setIsImageLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadProfilePic();
  }, [userId]);

  return (
    <div className="profile-pic-uploader">
      {imageURL && (
        <img
          src={imageURL}
          alt="Profile"
          className="profile-pic-preview"
        />
      )}
      
      <div className="file-input-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input">
          Choose a profile picture
        </label>
      </div>

      {imageLoadError && (
        <div className="error-message">
          {imageLoadError}
        </div>
      )}

      {isImageLoading && (
        <div className="loading-message">
          Loading image...
        </div>
      )}
    </div>
  );
};

export default ProfilePicUploader;
