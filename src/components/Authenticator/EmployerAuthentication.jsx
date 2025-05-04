import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import theme from './authTheme'
import '@aws-amplify/ui-react/styles.css'

import { Amplify } from 'aws-amplify'
import { signUp, signIn, signOut } from '@aws-amplify/auth'
import { useNavigate } from 'react-router-dom'
import employerConfig from '../../amplify-employer-config.js'
import '../../App.css'

function EmployerAuthentication({ onSignIn }) {
  const navigate = useNavigate()

  return (
    <div className="mt-5">
      <ThemeProvider theme={theme}>
        <Authenticator
          initialState="signIn"
          loginMechanisms={['username']}
          hideSignUp={false}
          services={{
            async handleSignUp(formData) {
              const { username, password, attributes } = formData;
              attributes['custom:userType'] = 'employer';
              return await signUp({ username, password, attributes });
            },
            async handleSignIn(formData) {
              try {
                // NOTE: The only place config and sign-out happen now
                await signOut();
                Amplify.configure(employerConfig);
                localStorage.setItem('isEmployer', 'true');

                const user = await signIn({
                  username: formData.username,
                  password: formData.password
                });

                console.log('✅ Employer login successful');
                if (onSignIn) onSignIn(user);
                navigate('/post-job');
                return user;
              } catch (err) {
                console.error('❌ Employer login failed:', err);
                throw err;
              }
            }
          }}
          formFields={{
            signUp: {
              username: {
                order: 1,
                isRequired: true,
                label: 'Username',
                placeholder: 'Choose a unique username',
              },
              nickname: {
                order: 2,
                isRequired: true,
                label: 'Company Name',
                placeholder: 'Your company name',
              },
              email: {
                order: 3,
                isRequired: true,
                label: 'Email',
                placeholder: 'company@example.com',
              },
              address: {
                order: 4,
                isRequired: true,
                label: 'Company Address',
                placeholder: '123 Main St, City, Country',
              },
              website: {
                order: 5,
                isRequired: true,
                label: 'Company Website',
                placeholder: 'https://example.com',
              },
              password: {
                order: 6,
                isRequired: true,
                label: 'Password',
                placeholder: 'Create a password',
              },
              confirm_password: {
                order: 7,
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
              Redirecting to job posting page...
              <br />
              <a href="/post-job" style={{ fontSize: '1rem', display: 'inline-block', marginTop: '1rem' }}>
                If you are not redirected automatically, click here
              </a>
            </div>
          )}
        </Authenticator>
      </ThemeProvider>
    </div>
  );
}

export default EmployerAuthentication;
