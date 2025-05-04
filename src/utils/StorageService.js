// src/utils/StorageService.js
import { getUrl, uploadData } from '@aws-amplify/storage';

/**
 * Upload a profile picture to S3 private storage.
 * @param {File} file - The selected image file.
 * @param {string} userId - The Cognito Identity ID or user sub.
 */
export const uploadProfilePicture = async (file, userId) => {
  const key = `profile-pics/${userId}.jpg`;
  try {
    const result = await uploadData({
      key,
      data: file,
      options: {
        accessLevel: 'private',
        contentType: file.type,
      },
    }).result;
    console.log('[S3] Upload success:', result);
    return key;
  } catch (error) {
    console.error('[S3] Upload failed:', error);
    throw error;
  }
};

/**
 * Get the URL of the current user's profile picture from S3.
 * @param {string} userId - The Cognito Identity ID or user sub.
 */
export const getProfilePictureUrl = async (userId) => {
  const key = `profile-pics/${userId}.jpg`;
  try {
    const { url } = await getUrl({
      key,
      options: {
        accessLevel: 'private',
      },
    });
    return url;
  } catch (error) {
    console.error('[S3] Failed to get profile picture URL:', error);
    throw error;
  }
};
