import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import EmployerAuthentication from './components/Authenticator/EmployerAuthentication'
import Navbar from './components/Home/Navbar'
import JobList from './components/JobPages/JobList'
import REUSites from './components/JobPages/REUSites'
import JobDetail from './components/JobPages/JobDetail'
import PostJob from './components/JobPages/PostJob'
import Home from './components/Home/Home'
import Authentication from './components/Authenticator/Authentication'
import ProtectedRoute from './components/Authenticator/ProtectedRoute'
import Profile from './components/Profile/Profile'
import EditProfile from './components/Profile/EditProfile'
import SavedJobs from './components/Profile/SavedJobs'
import { EmployerProvider } from './context/EmployerContext'


function AppContent() {
  const { authStatus } = useAuthenticator(context => [context.authStatus])

  if (authStatus === 'configuring') {
    return <div>Loading app...</div>
  }

  return (
    <Router>
      <EmployerProvider>
        <div className="App">
          <div className="container text-center">
            <br />
            <Navbar />
        </div>

        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route path="/employer-auth" element={<EmployerAuthentication />} />

          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <div className='container text-center'>
                <JobList />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/job/:id" element={
            <ProtectedRoute>
              <div className='container text-center'>
                <JobDetail />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/reu-sites" element={
            <ProtectedRoute>
              <div className='container text-center'>
                <REUSites />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/saved-jobs" element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      </EmployerProvider>
    </Router>
  )
}

function App() {
  return (
    <Authenticator.Provider>
      <AppContent />
    </Authenticator.Provider>
  )
}

export default App
