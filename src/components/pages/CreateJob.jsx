// src/components/pages/CreateJob.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createJob, fetchJobs } from "../../redux/JobSlice";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
  });

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const result = await dispatch(createJob(newJob));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchJobs()); // ✅ refresh job list
      const jobId = result.payload?._id;
      alert("Job created successfully!");

      // ✅ redirect
      if (jobId) {
        navigate(`/jobs/${jobId}`);
      } else {
        navigate("/jobs");
      }
    }

    // ✅ reset form
    setNewJob({
      title: "",
      description: "",
      company: "",
      location: "",
      salary: "",
    });
  };

  return (
    <div className="p-6 min-h-screen bg-[#0B1530] text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Post a Job</h1>
      <form onSubmit={handleCreateJob} className="space-y-4 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Job Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          required
          className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
        />
        <textarea
          placeholder="Job Description"
          value={newJob.description}
          onChange={(e) =>
            setNewJob({ ...newJob, description: e.target.value })
          }
          required
          className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="Company"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          required
          className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          required
          className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
        />
        <input
          type="number"
          placeholder="Salary"
          value={newJob.salary}
          onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
          className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[#4285F4] hover:bg-[#357AE8] rounded-lg font-semibold w-full"
        >
          Create Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
