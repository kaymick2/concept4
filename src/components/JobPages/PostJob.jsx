// PostJob.jsx
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function PostJob() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    salaryRange: '',
    description: '',
    jobUrl: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobItem = {
      application_url: formData.jobUrl || "N/A",
      company_id: uuidv4(),
      currency: "USD",
      location: formData.location,
      sponsored: "0",
      zip_code: "",
      views: 0,
      min_salary: parseInt(formData.salaryRange) || 0,
      pay_period: "YEARLY",
      work_type: "FULL_TIME",
      formatted_work_type: "Full-time",
      applies: "0.0",
      normalized_salary: parseInt(formData.salaryRange) || 0,
      company_name: formData.companyName,
      original_listed_time: Date.now().toString(),
      fips: "",
      compensation_type: "BASE_SALARY",
      formatted_experience_level: "Entry level",
      description: formData.description,
      job_posting_url: formData.jobUrl || "N/A",
      max_salary: parseInt(formData.salaryRange) || 120000,
      application_type: "OffsiteApply",
      title: formData.jobTitle
    };

    try {
      const response = await fetch("https://kz4iqk1zg5.execute-api.us-east-2.amazonaws.com/test/writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          body: JSON.stringify(jobItem)
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      alert('Job posted successfully!');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="jobTitle"
          placeholder="Job Title"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="salaryRange"
          placeholder="Salary Range"
          onChange={handleChange}
        />
        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Brief Description"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="jobUrl"
          placeholder="Company Page URL"
          onChange={handleChange}
        />
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PostJob;
