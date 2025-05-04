/**
 * JobDataService.js
 * 
 * A service that manages job data fetching, caching, and state management.
 * This service implements a caching strategy to reduce loading times for job data
 * by storing fetched data in memory and providing it to components that need it.
 */

// Cache storage for job data
let jobCache = {
  allJobs: null,
  jobDetails: {},
  lastFetched: null,
  isFetching: false,
  listeners: []
};

// Cache expiration time in milliseconds (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

/**
 * Check if the cache is valid (not expired)
 * @returns {boolean} True if cache is valid, false otherwise
 */
const isCacheValid = () => {
  return (
    jobCache.lastFetched && 
    (Date.now() - jobCache.lastFetched) < CACHE_EXPIRATION
  );
};

/**
 * Subscribe to job data changes
 * @param {Function} listener - Callback function to be called when job data changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToJobData = (listener) => {
  jobCache.listeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    jobCache.listeners = jobCache.listeners.filter(l => l !== listener);
  };
};

/**
 * Notify all listeners about job data changes
 */
const notifyListeners = () => {
  jobCache.listeners.forEach(listener => listener(jobCache.allJobs));
};

/**
 * Fetch all jobs from the API
 * @param {boolean} forceRefresh - Whether to force a refresh of the cache
 * @returns {Promise<Array>} Promise that resolves to an array of job objects
 */
export const fetchAllJobs = async (forceRefresh = false) => {
  // Return cached data if it's valid and no refresh is forced
  if (jobCache.allJobs && isCacheValid() && !forceRefresh) {
    console.log('Using cached job data');
    return jobCache.allJobs;
  }
  
  // Prevent multiple simultaneous fetches
  if (jobCache.isFetching) {
    console.log('Already fetching job data, waiting...');
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!jobCache.isFetching && jobCache.allJobs) {
          clearInterval(checkInterval);
          resolve(jobCache.allJobs);
        }
      }, 100);
    });
  }
  
  try {
    jobCache.isFetching = true;
    console.log('Fetching fresh job data from API');
    
    const response = await fetch(
      'https://ixmv8lw2lj.execute-api.us-east-2.amazonaws.com/linkedinDB/reading'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    const data = await response.json();
    const jobsArray = Array.isArray(data.body) ? data.body : [];
    
    // Add creation date to each job
    const jobsWithDate = jobsArray.map(job => ({
      ...job,
      creation_date: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    }));
    
      // Update cache
    jobCache.allJobs = jobsWithDate;
    jobCache.lastFetched = Date.now();
    
    // Notify listeners about the update
    notifyListeners();
    
    return jobsArray;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  } finally {
    jobCache.isFetching = false;
  }
};

/**
 * Get random featured jobs
 * @param {number} count - Number of random jobs to return
 * @returns {Promise<Array>} Promise that resolves to an array of random job objects
 */
export const getFeaturedJobs = async (count = 3) => {
  try {
    const allJobs = await fetchAllJobs();
    // Shuffle and select random jobs
    return [...allJobs]
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  } catch (error) {
    console.error('Error getting featured jobs:', error);
    return [];
  }
};

/**
 * Fetch details for a specific job
 * @param {string} jobId - ID of the job to fetch
 * @param {boolean} forceRefresh - Whether to force a refresh of the cache
 * @returns {Promise<Object>} Promise that resolves to a job object
 */
export const fetchJobDetails = async (jobId, forceRefresh = false) => {
  // Return cached job details if available and not forcing refresh
  if (jobCache.jobDetails[jobId] && !forceRefresh) {
    console.log(`Using cached details for job ${jobId}`);
    return jobCache.jobDetails[jobId];
  }
  
  try {
    console.log(`Fetching details for job ${jobId}`);
    
    // Try to find the job in the all jobs cache first
    if (jobCache.allJobs && !forceRefresh) {
      const cachedJob = jobCache.allJobs.find(job => job.job_id === jobId);
      if (cachedJob) {
        jobCache.jobDetails[jobId] = cachedJob;
        return cachedJob;
      }
    }
    
    // If not found in cache or forcing refresh, fetch from API
    const response = await fetch(
      `https://ixmv8lw2lj.execute-api.us-east-2.amazonaws.com/linkedinDB/reading?id=${jobId}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch job details');
    }
    
    const data = await response.json();
    const jobDetails = data.body[0];
    
    if (!jobDetails) {
      throw new Error('Job not found');
    }
    
    // Update cache
    jobCache.jobDetails[jobId] = jobDetails;
    
    return jobDetails;
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    throw error;
  }
};

/**
 * Preload job data in the background
 * This function can be called when the application initializes
 * to start loading job data before the user navigates to the jobs page
 */
export const preloadJobData = () => {
  console.log('Preloading job data in background');
  // Use setTimeout to not block the main thread during app initialization
  setTimeout(() => {
    fetchAllJobs().catch(error => {
      console.error('Error preloading job data:', error);
    });
  }, 1000); // Delay by 1 second to prioritize initial app rendering
};

/**
 * Clear the job cache
 * Useful for testing or when user logs out
 */
export const clearJobCache = () => {
  jobCache = {
    allJobs: null,
    jobDetails: {},
    lastFetched: null,
    isFetching: false,
    listeners: [...jobCache.listeners] // Preserve listeners
  };
  console.log('Job cache cleared');
};