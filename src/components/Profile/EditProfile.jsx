/**
 * EditProfile.jsx
 * 
 * This component provides a form for users to edit their profile information.
 * It fetches current user attributes from AWS Cognito and allows updating them.
 * The component handles form validation and submission to update user attributes.
 */

// Import AWS Amplify authentication hooks and utilities
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes, updateUserAttributes } from '@aws-amplify/auth';

// Import React hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import ProfilePicUploader component
import ProfilePicUploader from './ProfilePicUploader';

// Import styles
import './Profile.css';

import '../../App.css'

/**
 * EditProfile Component
 * 
 * A component that allows users to edit their profile information.
 * Fetches current user attributes and provides a form to update them.
 * 
 * @returns {JSX.Element} The rendered edit profile component
 */
function EditProfile() {
  // Get the current authenticated user from Amplify
  const { user } = useAuthenticator((context) => [context.user]);
  // State to store the user's attributes
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  
  // State for form submission status and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  
  // Navigation hook for redirecting after successful update
  const navigate = useNavigate();

  /**
   * Effect hook to fetch user attributes when the component mounts
   * or when the user changes (e.g., after login/logout)
   */
  useEffect(() => {
    if (user) {
      // Fetch current user attributes from Cognito
      fetchUserAttributes()
        .then(attributes => {
          // Set form data with current user attributes
          setFormData({
            fullName: attributes.name || '',
            email: attributes.email || ''
          });
        })
        .catch(err => {
          // Log any errors that occur during attribute fetching
          console.error('Failed to fetch attributes:', err);
          setError('Failed to load user information. Please try again.');
        });
    }
  }, [user]); // Re-run effect when user changes

  /**
   * Handle form input changes
   * 
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submission to update user attributes
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Prepare attributes object for update
      const attributesToUpdate = {
        name: formData.fullName,
        email: formData.email
      };
      
      // Update user attributes in Cognito
      await updateUserAttributes({
        userAttributes: attributesToUpdate
      });

      // If email was changed, set verification required flag
      const currentAttributes = await fetchUserAttributes();
      if (formData.email !== currentAttributes.email) {
        setVerificationRequired(true);
        setSuccess(true);
        return; // Don't redirect yet - user needs to verify email
      }

      // Show success message
      setSuccess(true);
      
      // Redirect to profile page after short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Failed to update attributes:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display message if user is not authenticated
  if (!user) {
    return (
      <div className='profile-page'>
        <p>Please sign in to edit your profile.</p>
      </div>
    );
  }

  /**
   * Render the edit profile form
   */
  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Edit Profile</h1>
        
        {/* Profile Picture Section */}
        <div className='profile-picture-container'>
          <ProfilePicUploader userId={user.userId} />
        </div>
        
        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Full Name Field */}
          <div className="form-group mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Email Field (read-only for now) */}
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <small className="text-muted">
              Changing your email will require verification
            </small>
          </div>
          

          
          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="alert alert-success" role="alert">
              {verificationRequired
                ? "Please check your new email for a verification code. Your profile will be updated once verified."
                : "Profile updated successfully! Redirecting to profile page..."}
            </div>
          )}
          
          {/* Form Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/profile')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;