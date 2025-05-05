import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify';
// import { Storage } from 'aws-amplify/storage'; 
import awsconfig from './amplify-config.js'
import { preloadJobData } from './utils/JobDataService.js'

// Configure Amplify *once* here
Amplify.configure(awsconfig)

// Preload job data
preloadJobData()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
