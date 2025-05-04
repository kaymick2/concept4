/**
 * JobList.jsx
 * 
 * This component displays a paginated, searchable list of job listings.
 * It allows users to filter jobs by search term and location, and navigate to job details.
 * The component uses JobDataService to fetch and cache job data, improving load times.
 */

import React, { useState, useEffect, useContext, createContext } from 'react';
import { Link } from 'react-router-dom';
import './JobPages.css'; // Import the external CSS file
import { fetchAllJobs } from '../../utils/JobDataService'; // Import the job data service
import SaveJobButton from '../Profile/SaveJobButton'; // Import SaveJobButton component
import { useAuthenticator } from '@aws-amplify/ui-react'; // Import authentication hook
import { getSavedJobs } from '../../utils/savedJobsDB'; // Import getSavedJobs utility
import '../../App.css'

/**
 * FilterContext
 * 
 * React Context used to share filter state between the JobList component and its child FilterControls component.
 * This allows filter controls to be defined in a separate component while maintaining shared state.
 */
const FilterContext = createContext();

/**
 * JobList Component
 * 
 * Main component that displays a paginated and filterable list of job listings.
 * Fetches job data from an AWS API Gateway endpoint and provides an interface
 * for users to browse, filter, and interact with job listings.
 * 
 * @returns {JSX.Element} The rendered JobList component
 */

const formatSalary = (amount, currency) => {
    if (typeof amount !== 'number') return '';
    const formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    return currency === 'USD' ? `$${formatted}` : `${formatted} ${currency}`;
};
const JobList = () => {
    // State for job listings data
    const [jobs, setJobs] = useState([]);
    // Loading state to show loading indicator
    const [loading, setLoading] = useState(true);
    // Error state to handle and display fetch errors
    const [error, setError] = useState(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const jobsPerPage = 10; // Number of jobs per page

    // Get the current authenticated user from Amplify
    const { user } = useAuthenticator((context) => [context.user]);
    
    // State to store saved job IDs
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    
    // Effect to fetch saved jobs when user is authenticated
    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (user) {
                try {
                    const savedJobs = await getSavedJobs(user.username);
                    const savedIds = new Set(savedJobs.map(job => job.jobID));
                    setSavedJobIds(savedIds);
                } catch (err) {
                    console.error('Error fetching saved jobs:', err);
                }
            }
        };
        
        fetchSavedJobs();
    }, [user]); // Re-run when user changes
    
    // Filter state with default empty values
    const [filters, setFilters] = useState({ 
        location: "", // Filter by job location (state)
        company: "", // Filter by company name
        formatted_work_type: "", // Filter by job type (full-time, part-time, etc.)
        minSalary: "", // Filter by minimum salary
        maxSalary: "", // Filter by maximum salary
        experience_level: "" // Filter by required experience level
    });

    const [searchQuery, setSearchQuery] = useState(""); // New state for search query

    /**
     * Effect hook to fetch job data when component mounts
     * 
     * Uses the JobDataService to retrieve job listings from cache or API if needed.
     * This improves performance by avoiding unnecessary API calls when data is already available.
     */


    useEffect(() => {
        const loadJobs = async () => {
            try {
                // Use JobDataService to fetch jobs (will use cache if available)
                const jobsArray = await fetchAllJobs();
                
                // Update state with the fetched jobs
                setJobs(jobsArray);
                setTotalJobs(jobsArray.length);
            } catch (err) {
                console.error("Error loading jobs:", err);
                setError(err.message);
            } finally {
                // Set loading to false regardless of success or failure
                setLoading(false);
            }
        };
        
        // Execute the load function
        loadJobs();
    }, []); // Empty dependency array means this effect runs once on mount

    /**
     * Filter jobs based on the current filter criteria
     * 
     * Applies all active filters to the jobs array and returns only the jobs that match all criteria.
     * Each filter is only applied if it has a non-empty value, allowing for flexible filtering.
     */
    const filteredJobs = jobs.filter(job => 
        // Location filter - checks if job location includes the selected state code
        (filters.location.length === 0 || (job.location && filters.location.some((loc) => job.location.includes(loc)))) &&
        // Company name filter - case-insensitive partial match
        (filters.company === "" || (job.company_name && job.company_name.toLowerCase().includes(filters.company.toLowerCase()))) &&   
        // Minimum salary filter - checks if job salary is at least the specified amount
        (filters.minSalary === "" || (job.min_salary && job.min_salary >= parseFloat(filters.minSalary))) &&
        // Maximum salary filter - checks if job salary is at most the specified amount
        (filters.maxSalary === "" || (job.max_salary && job.max_salary <= parseFloat(filters.maxSalary))) &&
        // Experience level filter - matches required experience level
        (filters.formatted_experience_level === "" || (job.formatted_experience_level && job.formatted_experience_level.toLowerCase().includes(filters.experience_level.toLowerCase()))) &&
        // Search query filter - checks if job title includes the search query
        (searchQuery === "" || job.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    /**
     * Pagination logic
     * 
     * Calculates the current page of jobs to display based on the current page number
     * and the number of jobs per page. Also calculates the total number of pages.
     */
    const pagesPerSet = 10;
    const currentSet = Math.floor((currentPage - 1) / pagesPerSet);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startPage = currentSet * pagesPerSet + 1;
    const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    // Get only the jobs for the current page
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    // Calculate total number of pages based on filtered jobs count
    // const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    /**
     * Handle page change when user clicks pagination controls
     * 
     * @param {number} newPage - The page number to navigate to
     */
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) return <p>Loading jobs. Please be patient!</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            <div className="container py-4">
                <h1 className="mb-5 bold">Job Listings</h1>
                
                <div className='row gx-5'>
                    {/* Sidebar */}
                    <div className='col-md-2'>
                        {/* Search bar */}
                        <div className='filter-container mb-3'>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by job title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Filters */}
                        <FilterControls />
                    </div>
                    {/* Job Listings */}
                    <div className='col-md-10'>
                        <div className='list-group mb-4'>
                            {currentJobs.map((job) => (
                                <div key={job.job_id} className='list-group-item job-list-item'>
                                    <SaveJobButton 
                                        jobData={job} 
                                        className='save-job-icon-btn'
                                        initialSaved={savedJobIds.has(job.job_id)}
                                    />
                                    <h5>
                                        <Link to={`/job/${job.job_id}`} className='job-title'>{job.title}</Link>
                                    </h5>
                                    <p><strong>{job.company_name}</strong> - {job.location}</p>
                                    <p>
                                        <strong>Salary: </strong> 
                                        {formatSalary(parseFloat(job.min_salary), job.currency)} - {formatSalary(parseFloat(job.max_salary), job.currency)} {job.pay_period}
                                    </p>
                                    <p>{job.description.substring(0, 200)}...</p>
                                    <div className="d-flex gap-2 mt-2">
                                        <a href={job.job_posting_url} target="_blank" rel="noopener noreferrer" className="btn-outline-black">
                                            Apply Now
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination Controls */}
                        
                        <nav aria-label="Pagination">
                            <ul className="pagination justify-content-center custom-pagination">
                                {startPage > 1 && (
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => handlePageChange(startPage - 1)}>&laquo;</button>
                                    </li>
                                )}
                                {Array.from({ length: endPage - startPage + 1 }, (_, index) =>(
                                    <li key={startPage + index} className={`page-item ${currentPage === startPage + index ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(startPage + index)}>
                                            {startPage + index}
                                        </button>
                                    </li>
                                ))}
                                {endPage < totalPages && (
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => handlePageChange(endPage + 1)}>&raquo;</button>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </FilterContext.Provider>
    );
};

/**
 * FilterControls Component
 * 
 * A sidebar component that provides UI controls for filtering the job listings.
 * Uses the FilterContext to access and update the filter state from the parent JobList component.
 * Includes controls for filtering by company, location, work type, salary range, and experience level.
 * 
 * @returns {JSX.Element} The rendered filter controls
 */
const FilterControls = () => {
    // Access the filter state and setter from context
    const { filters, setFilters } = useContext(FilterContext);
    // State to track whether filters are expanded or collapsed (for mobile view)
    const [expanded, setExpanded] = useState(false);
  
    /**
     * Toggle the expanded state of the filter controls
     */
    const handleToggle = () => setExpanded(!expanded);

    const resetFilters = () => {
        setFilters({
            location: [],
            company: "",
            formatted_work_type: "",
            minSalary: "",
            maxSalary: "",
            experience_level: ""
        });
    };

    const handleLocationChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFilters({ ...filters, location: selectedOptions });
    };
  
    return (
      <div className="filter-container">
          {/* Toggle Filters Button */}
          <button className="filter-toggle" onClick={handleToggle}>{expanded ? "- Filters" : "+ Filters"}</button>
          {expanded && (
          <div className="filter-options">
              {/* Company name filter */}
              <label className="label">
                  Company:
                  <input
                    type='text'
                    name='company'
                    value={filters.company}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    className="input-field"
                    placeholder='Enter company name'
                  />
              </label>
              {/* Location Dropdown */}
              <label className="label">
                        Location (Ctrl-Click for multiple):
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleLocationChange}
                            className="dropdown"
                            multiple
                        >
                    <option value="">All Locations</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
              </label>
              
              {/* Min Salary Filter */}
              <label className="label">
                  Salary:
                </label>

                <div className='salary-slider mb-4'>
                    <div className='slider-wrapper'>
                        <input 
                            type='range'
                            min='0'
                            max='300000'
                            step='1000'
                            value={filters.minSalary || 0}
                            onChange={(e) => {
                                const newMin = Number(e.target.value);
                                if (newMin <= filters.maxSalary) {
                                    setFilters({ ...filters, minSalary: newMin });
                                }
                            }}
                            className='slider slider-min'
                        />
                        <input
                            type='range'
                            min='0'
                            max='300000'
                            step='1000'
                            value={filters.maxSalary || 300000}
                            onChange={(e) => {
                                const newMax = Number(e.target.value);
                                if (newMax >= filters.minSalary) {
                                    setFilters({ ...filters, maxSalary: newMax });
                                }
                            }}
                            className='slider slider-max'
                        />
                    </div>

                    <div className='d-flex justify-content-between mt-2'>
                        <small>${Number(filters.minSalary || 0).toLocaleString()}</small>
                        <small>${Number(filters.maxSalary || 300000).toLocaleString()}+</small>
                    </div>
                </div>
                  

              {/* Work experience Dropdown */}
              <label className="label">
                Work Experience:
                <select 
                    name='experience_level' 
                    value={filters.experience_level} 
                    onChange={(e) => setFilters({ ...filters, experience_level: e.target.value })}
                    className="dropdown"
                >
                    <option value="">All types</option>
                    <option value="Entry level">Entry</option>
                    <option value="Mid level">Mid</option>
                    <option value="Senior level">Senior</option>
                </select>
            </label>

            {/* Reset Filters Button */}
            <button className="btn btn-secondary mt-3" onClick={resetFilters}>
                  Reset Filters
            </button>

          </div>
      )}
  </div>
  
    );
  };
export default JobList;