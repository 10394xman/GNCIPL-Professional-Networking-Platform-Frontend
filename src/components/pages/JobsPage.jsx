// src/components/pages/JobPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, createJob } from "../../redux/JobSlice";

const JobPage = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth); // 👈 user.role check karne ke liye

  const [filters, setFilters] = useState({ search: "", location: "" });
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
  });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      job.location.toLowerCase().includes(filters.location.toLowerCase())
  );

  // ✅ Recruiter job create
  const handleCreateJob = (e) => {
    e.preventDefault();
    dispatch(createJob(newJob)).then(() => {
      dispatch(fetchJobs()); // ✅ job create hone ke baad refresh
    });
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
      <h1 className="text-3xl font-bold mb-6 text-center">Jobs</h1>

      {/* ✅ Candidate + Recruiter view: Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search by title..."
          value={filters.search}
          onChange={handleFilterChange}
          className="flex-1 p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#4285F4]"
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by location..."
          value={filters.location}
          onChange={handleFilterChange}
          className="flex-1 p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#4285F4]"
        />
      </div>

      {/* ✅ Recruiter view: Create Job Form */}
      {user?.role === "recruiter" && (
        <div className="bg-black/30 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
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
              onChange={(e) =>
                setNewJob({ ...newJob, company: e.target.value })
              }
              required
              className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={newJob.location}
              onChange={(e) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
              required
              className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Salary"
              value={newJob.salary}
              onChange={(e) =>
                setNewJob({ ...newJob, salary: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#4285F4] hover:bg-[#357AE8] rounded-lg font-semibold"
            >
              Create Job
            </button>
          </form>
        </div>
      )}

      {/* ✅ Jobs List */}
      <div>
        {status === "loading" && <p>Loading jobs...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}

        {status === "succeeded" && filteredJobs.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            {user?.role === "recruiter"
              ? "No jobs posted yet. Create your first job above!"
              : "No jobs available right now."}
          </p>
        )}

        {status === "succeeded" &&
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-black/20 p-6 rounded-xl shadow-md mb-4"
            >
              <h2 className="text-xl font-bold text-white">{job.title}</h2>
              <p className="text-gray-400">{job.company}</p>
              <p className="text-gray-400">{job.location}</p>
              <p className="mt-2">{job.description}</p>
              <p className="text-green-400 mt-2">
                💰 {job.salary ? `₹${job.salary}` : "Not Disclosed"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default JobPage;

