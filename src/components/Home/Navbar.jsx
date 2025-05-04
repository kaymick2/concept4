import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { useEmployer } from '../../context/EmployerContext';
import { getProfilePictureUrl } from '../../utils/StorageService';
import './NavBar.css';
import '../../App.css'

/**
 * Navbar Component
 *
 * A responsive navigation bar component that provides site-wide navigation and search functionality.
 * Uses Bootstrap for styling and responsive behavior.
 */
function Navbar() {
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);
  const [userAttributes, setUserAttributes] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const { isEmployer } = useEmployer();

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');

    if (user) {
      fetchUserAttributes()
        .then(attributes => {
          setUserAttributes(attributes);
          return getProfilePictureUrl(user.userId);
        })
        .then(url => {
          setProfilePicUrl(url);
        })
        .catch(err => {
          if (err.message?.includes('No profile picture found')) {
            console.warn('No profile picture set');
          } else {
            console.error('Failed to fetch user data:', err);
          }
        });
    }
  }, [user]);

    useEffect(() => {
    console.log('Current isEmployer status:', isEmployer);
  }, [isEmployer]);

  return (
    <nav className="navbar navbar-expand-lg navbar-customcolor fixed-top">
      <div className="container-fluid">

        {/* Brand/logo link */}
        <Link
          className="navbar-brand bold d-flex align-items-center"
          to="/"
          style={{ fontFamily: 'Comfortaa, cursive' }}
        >
          <img src="/logo.png" alt="JobSearch logo" style={{ height: '45px', marginRight: '10px' }} />
          jobsearch
        </Link>

        <div className="d-flex align-items-center">
          {/* Mobile toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* User profile icon for mobile view */}
          {user && (
            <div className="d-lg-none">
              <button
                className="initials-circle"
                type="button"
                id="userDropdownMobile"
                data-bs-toggle="dropdown"
                style={profilePicUrl ? {
                  backgroundImage: `url(${profilePicUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'transparent'
                } : {}}
              >
                {!profilePicUrl && (userAttributes?.name
                  ? userAttributes.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
                  : user.username.slice(0, 2).toUpperCase())}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdownMobile">
                <li><Link className="dropdown-item" to="/profile">View Profile</Link></li>
                <li><Link className="dropdown-item" to="/saved-jobs">Saved Jobs</Link></li>
                {isEmployer && (
                  <li><Link className="dropdown-item" to="/post-job">Post Job</Link></li>
                )}
                <li><button className="dropdown-item" onClick={signOut}>Sign Out</button></li>
              </ul>
            </div>
          )}
        </div>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto lato-regular">
            <li className="nav-item">
              <NavLink className="nav-link" to="/jobs">Jobs</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/reu-sites">Research Opportunities</NavLink>
            </li>
          </ul>

          {/* Auth section */}
          <div className="d-flex align-items-center">
            

            {user ? (
              <div className="d-none d-lg-block">
                <button
                  className="initials-circle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  style={profilePicUrl ? {
                    backgroundImage: `url(${profilePicUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'transparent'
                  } : {}}
                >
                  {!profilePicUrl && (userAttributes?.name
                    ? userAttributes.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
                    : user.username.slice(0, 2).toUpperCase())}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><Link className="dropdown-item" to="/profile">View Profile</Link></li>
                  <li><Link className="dropdown-item" to="/saved-jobs">Saved Jobs</Link></li>
                  {isEmployer && (
                    <li><Link className="dropdown-item" to="/post-job">Post Job</Link></li>
                  )}
                  <li><button className="dropdown-item" onClick={signOut}>Sign Out</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/employer-auth" className="btn btn-outline-light me-2">Employer</Link>
                <Link to="/auth" className="btn btn-primary">Sign In / Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
