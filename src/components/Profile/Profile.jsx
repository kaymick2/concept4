import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SavedJobs from './SavedJobs';
import './Profile.css';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { getProfilePictureUrl } from '../../utils/StorageService';
import { isEmployerUser } from '../../utils/authUtils';
import '../../App.css'

function Profile() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [userAttributes, setUserAttributes] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('/images/profilepic.png');
  const [isEmployer, setIsEmployer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      Promise.all([fetchUserAttributes(), isEmployerUser()])
        .then(async ([attributes, employerStatus]) => {
          setIsEmployer(employerStatus);

          const parsed = {
            username: user.username,
            fullName: attributes.name || '',
            email: attributes.email || '',
            createdAt: user?.signInDetails?.authTime
              ? new Date(user.signInDetails.authTime * 1000).toLocaleDateString()
              : 'Unknown',
            authProvider: user?.signInDetails?.authFlowType || 'cognito'
          };

          setUserAttributes(parsed);

          // TODO: fetch profile pic with sub
          const sub = attributes.sub;
          console.log('[Profile.jsx] User sub:', sub);

          try {
            const picUrl = await getProfilePictureUrl(sub);
            console.log('[Profile.jsx]  Profile pic URL:', picUrl);
            setProfilePicUrl(picUrl);
          } catch (err) {
            console.error('[Profile.jsx]  Failed to fetch profile picture:', err);
          }
        })
        .catch(err => {
          console.error('Failed to fetch attributes:', err);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <div className='profile-page'>
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  if (!userAttributes) {
    return (
      <div className='profile-page'>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className='profile-picture-container'>
          <img
            src={profilePicUrl}
            alt="Profile"
            className='profile-picture'
          />
        </div>
        <div className='profile-card'>
          <h1 className='profile-title'>User Profile</h1>
          <div className="profile-info">
            <InfoRow label="Full Name" value={userAttributes.fullName} />
            <InfoRow label="Username" value={userAttributes.username} />
            <InfoRow label="Email" value={userAttributes.email} />
            <InfoRow label="Member Since" value={userAttributes.createdAt} />
            <InfoRow label="Auth Provider" value={userAttributes.authProvider} />
            <InfoRow label="Account Type" value={isEmployer ? 'Employer' : 'Job Seeker'} />
          </div>
          <div className='edit-button-container'>
            <button 
              className='edit-button'
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </button>
          </div>  
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}:</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

export default Profile;
