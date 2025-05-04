/**
 * REUDetail.jsx
 * 
 * This component displays detailed information about a specific Research Experience for Undergraduates (REU) listing.
 * It fetches REU data from an AWS API Gateway endpoint based on the REU ID from the URL parameters
 * and renders a comprehensive view of the REU program details.
 */

// Import React hooks
import React, { useState, useEffect } from 'react';
// Import React Router hook to access URL parameters
import { useParams } from 'react-router-dom';
// Import styles
import './JobREUDetails.css'; // Import the external CSS file
import '../../App.css'

/**
 * REUDetail Component
 * 
 * A component that displays detailed information about a specific REU program.
 * Fetches REU data from an AWS API Gateway endpoint based on the REU ID from URL parameters.
 * 
 * @returns {JSX.Element} The rendered REU detail component
 */
const REUDetail = () => {
  // Extract REU ID from URL parameters
  const { reuId } = useParams();
  // State to store the REU data
  const [reu, setReu] = useState(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to track and display any errors
  const [error, setError] = useState(null);

  /**
   * Effect hook to fetch REU details when the component mounts
   * or when the REU ID changes
   */
  useEffect(() => {
    /**
     * Async function to fetch REU details from the API
     */
    const fetchReu = async () => {
      try {
        // Fetch REU data from the API Gateway endpoint using the REU ID
        const response = await fetch(`https://lan4l8uk4f.execute-api.us-east-2.amazonaws.com/test/reading?id=${reuId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch REU details');
        }
        const data = await response.json();
        
        // Update state with the fetched REU
        setReu(data[0]);
      } catch (err) {
        // Set error state if fetch fails
        setError(err.message);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchReu();
  }, [reuId]); // Re-run effect when REU ID changes

  // Display loading indicator while fetching data
  if (loading) return <p>Loading REU details...</p>;
  // Display error message if an error occurred
  if (error) return <p>Error: {error}</p>;
  // Display message if no REU was found
  if (!reu) return <p>No REU found</p>;

  /**
   * Render the REU details
   */
  return (
    <div className="reu-container py-4">
      <h1 className="reu-title mb-4">{reu.Title}</h1>
      <div className="reu-card">
        <div className="reu-card-body">
          <h4 className="reu-institution text-muted mb-4">{reu.Institution}</h4>
          <div className="reu-info-row row mb-4">
            <div className="col-md-6">
              <p><strong>Location:</strong> {reu["Institution City"]}, {reu["Institution State/Territory"]}</p>
              <p><strong>Department:</strong> {reu["Institution Department"] || 'Not specified'}</p>
              <p><strong>Research Areas:</strong> {reu["Research Areas"] || 'Not specified'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Research Topics/Keywords:</strong> {reu["Research Topics/Keywords"] || 'Not specified'}</p>
              <p><strong>Contact:</strong> {reu["Primary Contact Name"] || 'Not specified'}</p>
              <p><strong>Contact Email:</strong> <a href={`mailto:${reu["Primary Contact Email"]}`}>{reu["Primary Contact Email"] || 'Not available'}</a></p>
            </div>
          </div>
          <div className="reu-website mt-4">
            <a href={reu["Site Website"]} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Visit REU Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default REUDetail;
