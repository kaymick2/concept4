/**
 * SaveJobButton.jsx
 * 
 * This component provides a button that allows users to save job listings to their profile.
 * It integrates with the savedJobsDB utility to store job data in DynamoDB and requires
 * user authentication to function.
 */

// Import React hooks
import { useState, useEffect } from 'react'

// Import AWS Amplify authentication hook
import { useAuthenticator } from '@aws-amplify/ui-react'

// Import the saveJob, isJobSaved, and removeSavedJob functions from the savedJobsDB utility
import { saveJob, isJobSaved, removeSavedJob } from '../../utils/savedJobsDB'

// Import styles
import '/src/components/JobPages/JobREUDetails.css'

import '../../App.css'

/**
 * SaveJobButton Component
 * 
 * A button component that allows authenticated users to save job listings to their profile.
 * Uses the savedJobsDB utility to store job data in DynamoDB.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.jobData - The job data to save (must include id, title, and other job details)
 * @param {Function} props.onSaved - Optional callback function to execute after successfully saving a job
 * @returns {JSX.Element} The rendered save button component
 */
function SaveJobButton({ jobData, jobId, onSaved, className, initialSaved = false }) {
  // Get the current authenticated user from Amplify
  const { user } = useAuthenticator((context) => [context.user])
  
  // State to track the saving process
  const [saving, setSaving] = useState(false)

  const [saved, setSaved] = useState(initialSaved)
  
  // State to track and display any errors
  const [error, setError] = useState(null)

  // Use the job ID from either jobData or the jobId prop
  const currentJobId = jobData?.job_id || jobId
  
  // Effect to check if the job is saved when component mounts
  useEffect(() => {
    const checkIfJobIsSaved = async () => {
      if (user && currentJobId) {
        try {
          const isSaved = await isJobSaved(user.username, currentJobId)
          setSaved(isSaved)
        } catch (err) {
          console.error('Error checking if job is saved:', err)
        }
      }
    }
    
    // Only run the check if initialSaved is false (not already known to be saved)
    if (!initialSaved) {
      checkIfJobIsSaved()
    }
  }, [user, currentJobId, initialSaved]) // Re-run when user, jobId, or initialSaved changes

  /**
   * Handle the toggle save/unsave job action
   * 
   * This function is called when the user clicks the Save Job button.
   * It checks if the user is authenticated, then calls either saveJob or removeSavedJob
   * from the savedJobsDB utility based on the current saved state.
   */
  const toggleSave = async () => {
    // Check if user is authenticated
    if (!user) {
      setError('Please sign in to save jobs')
      return
    }

    // Set saving state to show loading indicator
    setSaving(true)
    // Clear any previous errors
    setError(null)

    try {
      if (saved) {
        // If already saved, remove the job
        await removeSavedJob(user.username, currentJobId)
        // Update saved state
        setSaved(false)
      } else {
        // If not saved, save the job
        await saveJob(user.username, jobData || { id: currentJobId })
        // Update saved state
        setSaved(true)
        
        // Call the onSaved callback if provided
        if (onSaved) {
          onSaved()
        }
      }
    } catch (err) {
      // Log and display any errors that occur
      console.error('Error toggling job save status:', err)
      setError('Failed to update job')
    } finally {
      // Reset saving state regardless of success or failure
      setSaving(false)
    }
  }

  /**
   * Render the save button and any error messages
   */
  return (
    <div>
      {/* Save job button with dynamic text based on saving state */}
      <button
        className={className || 'save-btn'}

        onClick={toggleSave}
        disabled={saving} // Disable button while saving
        style={{
          background: 'none',
          border: 'none',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img 
          src={saved ? '/images/bookmark-filled.png' : '/images/bookmark-outline.png'}
          alt={saved ? 'Saved' : 'Save job'}
          style={{ width: '24px', height: '24px' }}
        />
      </button>
      
      {/* Display error message if there is one */}
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  )
}

export default SaveJobButton
