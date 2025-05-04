// src/utils/authUtils.js

import { fetchUserAttributes } from 'aws-amplify/auth';

/**
 * Checks if the currently signed-in user is an employer.
 * An employer is defined as having a 'custom:company_name' attribute.
 * 
 * @returns {Promise<boolean>} True if the user is an employer, false otherwise
 */
export async function isEmployerUser() {
  try {
    const attributes = await fetchUserAttributes();
    console.log('User attributes:', attributes);

    // Check if custom:company_name exists and is non-empty
    return !!attributes['custom:company_name'];
  } catch (error) {
    console.error('Error checking employer status:', error);
    return false;
  }
}
