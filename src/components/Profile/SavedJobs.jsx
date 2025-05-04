import { useEffect, useState } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Link } from 'react-router-dom'
import { getSavedJobs, removeSavedJob } from '../../utils/savedJobsDB'
import '/src/components/JobPages/JobREUDetails.css'
import '../../App.css'
import './SavedJobs.css'

function SavedJobs() {
  const { user } = useAuthenticator((context) => [context.user])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const jobs = await getSavedJobs(user.username)
        setSavedJobs(jobs)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching saved jobs:', err)
        setError('Failed to load saved jobs')
        setLoading(false)
      }
    }

    if (user) {
      fetchSavedJobs()
    }
  }, [user])

  const handleRemoveJob = async (jobID) => {
    try {
      console.log(`Removing jobID: ${jobID} for user: ${user.username}`)
      await removeSavedJob(user.username, String(jobID))
      setSavedJobs(savedJobs.filter(job => job.jobID !== jobID))
    } catch (err) {
      console.error('Error removing job:', err)
      setError('Failed to remove job')
    }
  }

  if (loading) return <div className="text-center">Loading saved jobs...</div>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (savedJobs.length === 0) {
    return (
      <div className="no-jobs">
        <h3>No Saved Jobs</h3>
        <p>You haven't saved any jobs yet.</p>
      </div>
    )
  }

  return (
    <div className="saved-jobs-container">
      <div className="header">
        <h1 className='mb-4 bold'>Saved Jobs</h1>
      </div>
      <div className="jobs-list">
        {savedJobs.map((job) => (
          <div key={job.jobID} className="job-item">
            <div className="job-header">
              <h5>
                <Link to={`/job/${job.jobID}`} className="job-title-link">
                  {job.jobData?.title || 'Untitled Job'}
                </Link>
              </h5>
              <div className="job-actions">
                <a
                  href={job.jobData?.application_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-black"
                >
                  Apply Now
                </a>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveJob(job.jobID)}
                >
                  Remove
                </button>
              </div>
            </div>
            <p>{job.jobData?.company_name || 'Unknown Company'}</p>
            <small>
              Saved on {new Date(job.savedAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedJobs
