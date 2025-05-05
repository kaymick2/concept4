import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '/src/App.css';
import './Carousel.css';
import SaveJobButton from '../Profile/SaveJobButton';
import { getFeaturedJobs } from '../../utils/JobDataService';

/*
 * Home Component
 * 
 * Landing page component that displays a welcome message and image carousel.
 * Uses React Bootstrap for the carousel implementation.
 * 
 * Features:
 * - Responsive image carousel with auto-rotation
 * - Welcome message and testimonial
 * - Featured jobs section with 3 random jobs fetched from API
 * - Bootstrap-based layout and styling
 */
function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  // Fetch 3 random jobs using the JobDataService
  useEffect(() => {
    const loadFeaturedJobs = async () => {
      try {
        // Use the JobDataService to get featured jobs
        // This will use cached data if available
        const randomJobs = await getFeaturedJobs(3);
        setFeaturedJobs(randomJobs);
      } catch (error) {
        console.error('Failed to fetch featured jobs:', error);
      }
    };

    loadFeaturedJobs();
  }, []);
  
  // Show loading skeleton if no jobs are loaded yet
  const isLoading = featuredJobs.length === 0;

  return (
    <div>
      {/* Image carousel section with overlay text */}
      <div className="carousel-container position-relative">
        <Carousel data-bs-ride="carousel">
          {/* First slide - Group work image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/groupwork.jpg" alt="First slide" />
          </Carousel.Item>
          {/* Second slide - Office image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/office.jpg" alt="Second slide" />
          </Carousel.Item>
          {/* Third slide - Computer image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/computer.jpg" alt="Third slide" />
          </Carousel.Item>
          {/* Fourth slide - IMG_6204 image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/IMG_6204.JPG" alt="Fourth slide" />
          </Carousel.Item>
          {/* Fifth slide - Z image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/z.jpg" alt="Fifth slide" />
          </Carousel.Item>
        </Carousel>

        {/* Overlay title */}
        <div className="carousel-text">
          {/* <h1 className="display-3 text-white fw-bold">jobsearch</h1> */}
          <h1 className="display-3 text-white fw-bold" style={{ fontFamily: 'Comfortaa', marginBottom: '0.5rem' }}>
            jobsearch
          </h1>
          <h2 className="text-white" style={{ fontFamily: 'Comfortaa', fontSize: '1.5rem', fontWeight: '400' }}>
            no paywall, no fuss, just jobs
          </h2>
        </div>
      </div>

      {/* Main content inside "container" */}
      <div className="container">
        {/* Title */}
        <div className="title">
          <h1>
            {/* You can add a heading here */}
          </h1>
        </div>

        {/* Welcome message section */}
        <div className="app-description">
          <p>
            {/* Welcome to JobSearch, your tool to browse jobs and apply with a click of a button.
            Create your profile today to find your next job! */}
          </p>
        </div>

        {/* Solid border */}
        <hr className="solid" style={{ margin: '0 0 15px 0' }} />

        {/* Testimonial section */}
        <div className="bio-description">
          <p>
            {/* "JobSearch was a game-changer for me! I landed my dream job in just two weeks." <br />
            - Emily S. */}
          </p>
        </div>

        <div className="bio-description">
          <p>
            {/* "To say JobSearch is amazing is an understatement. I highly recommend it to everyone looking for a job!" <br />
            - Alex F. */}
          </p>
        </div>

        {/* Featured Jobs Section */}
        {/* <hr className="solid" style={{ margin: '15px 0' }} />
        <h2 className="mb-2">Featured Jobs</h2> */}
        <h2 className='featured-jobs-title'>Featured Jobs</h2>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4'>
          {featuredJobs.map((job) => (
            <div className='col d-flex' key={job.job_id}>
              <div className='card featured-job-card w-100'>
                <div className='card-body d-flex flex-column'>
                  <div className='job-content flex-grow-1'>
                    <Link to={`/job/${job.job_id}`} className='text-decoration-none' style={{ color: '#AAB493' }}>
                      <h5 className='card-title text-break'>{job.title}</h5>
                    </Link>
                    <h6 className='card-subtitle mb-2 text-break'>
                      {job.company_name} - {job.location}
                    </h6>
                    <p className='card-text'>
                      {job.description?.substring(0, 120)}...
                    </p>
                  </div>
                  <div className='mt-auto d-flex gap-2'>
                    <a href={job.job_posting_url} target='_blank' rel='noopener noreferrer' className='btn w-100' style={{ backgroundColor: '#AAB493', color: '#fff', border: 'none' }}>
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;


