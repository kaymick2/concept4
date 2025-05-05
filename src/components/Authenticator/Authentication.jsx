import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import theme from './authTheme';
import '@aws-amplify/ui-react/styles.css';

import { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import awsconfig from '../../amplify-config.js';
import '../../App.css';

function Authentication({ onSignIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    signOut().then(() => {
      Amplify.configure(awsconfig);
      localStorage.removeItem('isEmployer');
    });
  }, []);

  const handleSignInSuccess = (user) => {
    console.log('User login successful');
    if (onSignIn) onSignIn(user);
    navigate('/jobs');
  };

  return (
    <div className="mt-5">
      <ThemeProvider theme={theme}>
        <Authenticator
          loginMechanisms={['username']}
          hideSignUp={false}
          onSignIn={handleSignInSuccess}
          services={{
            async handleSignIn({ username, password }) {
              const user = await signIn({ username, password });
              handleSignInSuccess(user);
              return user;
            },
          }}
          formFields={{
            signUp: {
              username: {
                order: 1,
                isRequired: true,
                label: 'Username',
                placeholder: 'Choose a unique username',
              },
              email: {
                order: 2,
                isRequired: true,
                label: 'Email',
                placeholder: 'you@example.com',
              },
              name: {
                order: 3,
                isRequired: true,
                label: 'Full Name',
                placeholder: 'Your full name',
              },
              password: {
                order: 4,
                isRequired: true,
                label: 'Password',
                placeholder: 'Create a password',
              },
              confirm_password: {
                order: 5,
                isRequired: true,
                label: 'Confirm Password',
              },
            },
          }}
        >
          {() => (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              Redirecting to jobs page...
              <br />
              <a href="/jobs" style={{ fontSize: '1rem', display: 'inline-block', marginTop: '1rem' }}>
                If you are not redirected automatically, click here
              </a>
            </div>
          )}
        </Authenticator>
      </ThemeProvider>
    </div>
  );
}

export default Authentication;
