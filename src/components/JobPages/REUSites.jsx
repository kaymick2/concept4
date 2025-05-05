import React, { useState, useEffect, useContext, createContext } from 'react';
import './JobPages.css'; // Import the external CSS file
import '../../App.css';
import SaveJobButton from '../Profile/SaveJobButton';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getSavedJobs } from '../../utils/savedJobsDB';

const FilterContext = createContext();

function REUSites() { 
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSites, setTotalSites] = useState(0);
  const { user } = useAuthenticator((context) => [context.user]);
  const [savedSiteIds, setSavedSiteIds] = useState(new Set());
  const sitesPerPage = 10;
  const pagesPerSet = 10;
  const currentSet = Math.floor((currentPage - 1) / pagesPerSet);
  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  
  const [filters, setFilters] = useState({ 
    location: "",
    company: "", 
    discipline: "" 
  });

  useEffect(() => {
    const fetchSavedSites = async () => {
      if (user) {
        try {
          const savedSites = await getSavedJobs(user.username);
          const savedIds = new Set(savedSites.map(site => site.jobID));
          setSavedSiteIds(savedIds);
        } catch (err) {
          console.error('Error fetching saved sites:', err);
        }
      }
    };
    
    fetchSavedSites();
  }, [user]);

  useEffect(() => { 
    const fetchSites = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://lan4l8uk4f.execute-api.us-east-2.amazonaws.com/test/reading');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const sitesData = data.body || [];
        const mappedData = sitesData.map(item => ({
          id: item.Id,
          title: item.Title,
          institution: item.Institution,
          city: item["Institution City"],
          state: item["Institution State/Territory"],
          department: item["Institution Department"],
          discipline: item["Research Areas"],
          keywords: item["Research Topics/Keywords"],
          url: item["Site Website"],
          contact_name: item["Primary Contact Name"],
          contact_email: item["Primary Contact Email"],
        }));
        setSites(mappedData);
        setTotalSites(mappedData.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  const filteredSites = sites.filter(site => 
    (filters.location.length === 0 || (site.state && filters.location.some((loc) => site.state.includes(loc)))) &&
    (filters.company === "" || site.institution?.toLowerCase().includes(filters.company.toLowerCase())) &&
    (filters.discipline === "" || site.discipline?.toLowerCase().includes(filters.discipline.toLowerCase())) &&
    (searchQuery === "" || site.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPages = Math.ceil(filteredSites.length / sitesPerPage);
  const startPage = currentSet * pagesPerSet + 1;
  const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <p>Loading Opportunities. Please be patient!</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      <div className="container py-4">
        <h1 className="mb-5 bold">Research Opportunities</h1>

        {/* Mobile Filter Section */}
        <div className="d-md-none mb-4">
          <div className='filter-container mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder="Search by REU title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <FilterControls />
        </div>

        <div className="row gx-5">
          {/* Desktop Filter Sidebar */}
          <div className='col-md-2 d-none d-md-block'>
            <div className='filter-container mb-3'>
              <input
                type='text'
                className='form-control'
                placeholder="Search by REU title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <FilterControls />
          </div>
          
          {/* REU Listings */}
          <div className='col-12 col-md-10 ml-md-3'>
            <div className="list-group mb-4">
              {currentSites.length === 0 ? <p>No REU sites found.</p> : currentSites.map((site) => (
                <div key={site.id} className="list-group-item job-list-item">
                  <h5>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className='job-title'>
                      {site.title}
                    </a>
                  </h5>
                  <p><strong>{site.institution}</strong> - {site.city}, {site.state}</p>
                  <p><strong>Department:</strong> {site.department || 'Not specified'}</p>
                  <p><strong>Discipline:</strong> {site.discipline || 'Not specified'}</p>
                  <p><strong>Contact:</strong> {site.contact_name || 'Not specified'} | <a href={`mailto:${site.contact_email}`}>{site.contact_email || 'Not available'}</a></p>
                  <div className="mt-3">
                    <SaveJobButton jobData={{
                      job_id: site.id,
                      title: site.title,
                      company_name: site.institution,
                      location: `${site.city}, ${site.state}`,
                      description: `${site.discipline} - ${site.department}`,
                      job_posting_url: site.url
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <nav aria-label="Pagination">
              <ul className="pagination justify-content-center custom-pagination"> 
                {startPage > 1 && (
                  <li className="page-item">
                    <button className='page-link' onClick={() => handlePageChange(startPage - 1)}>&laquo;</button>
                  </li>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                  <li key={startPage + index} className={`page-item ${currentPage === startPage + index ? "active" : ""}`}>
                    <button className='page-link' onClick={() => handlePageChange(startPage + index)}>
                      {startPage + index}
                    </button>
                  </li>
                ))}
                {endPage < totalPages && (
                  <li className='page-item'>
                    <button className='page-link' onClick={() => handlePageChange(endPage + 1)}>&raquo;</button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </FilterContext.Provider>
  );
}

const FilterControls = () => {
  const { filters, setFilters } = useContext(FilterContext);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      location: [],
      company: "",
      discipline: ""
    });
  };

  const handleLocationChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFilters({ ...filters, location: selectedOptions });
};

  return (
    <div className="filter-container">
      <button className="filter-toggle" onClick={handleToggle}>
        {expanded ? "- Filters" : "+ Filters"}
      </button>
      {expanded && (
        <div className="filter-options">
          <label className="label">
            Institution:
            <input
              type="text"
              name="company"
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="input-field"
              placeholder="Enter institution name"
            />
          </label>
          {/* Discipline Filter */}
          <label className="label">
            Discipline:
            <select
              name="discipline"
              value={filters.discipline}
              onChange={(e) => setFilters({ ...filters, discipline: e.target.value })}
              className="dropdown"
            >
              <option value="">All Disciplines</option>
              <option value="Arctic & Antarctic">Arctic & Antarctic</option>
              <option value="Astronomy & Space">Astronomy & Space</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry & Materials">Chemistry & Materials</option>
              <option value="Computing">Computing</option>
              <option value="Earth & Environment">Earth & Environment</option>
              <option value="Education">Education</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Nanoscience">Nanoscience</option>
              <option value="People & Society">People & Society</option>
              <option value="Physics">Physics</option>
            </select>
          </label>
          {/* Location Filter */}
          <label className="label">
            Location (Ctrl-Click to select multiple):
            <select
              name="location"
              value={filters.location}
              onChange={handleLocationChange}
              className="dropdown"
              multiple
            >
              {/* List of states */}
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

          {/* Reset Filters Button */}
          <button className="btn btn-secondary mt-3" onClick={resetFilters}>
            Reset Filters
          </button>
          
        </div>
      )}
    </div>
  );
}

export default REUSites;
