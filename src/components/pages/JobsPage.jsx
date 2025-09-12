// src/components/pages/JobPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, applyJob, saveJob } from "../../redux/JobSlice";
import { Link } from "react-router-dom";

const JobPage = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({ search: "", location: "" });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = (jobId) => {
    dispatch(applyJob(jobId))
      .unwrap()
      .then(() => alert("✅ Applied successfully!"))
      .catch((err) =>
        alert(err?.message || "❌ Failed to apply for the job.")
      );
  };

  const handleSave = (jobId) => {
    dispatch(saveJob(jobId))
      .unwrap()
      .then(() => alert("💾 Job saved successfully!"))
      .catch((err) =>
        alert(err?.message || "❌ Failed to save the job.")
      );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      job.location.toLowerCase().includes(filters.location.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-[#0B1530] text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Jobs</h1>

      {/* Filters */}
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

      {/* Recruiter "Create Job" button */}
      {user?.role === "recruiter" && (
        <div className="mb-6 text-right">
          <Link
            to="/jobs/create"
            className="px-6 py-3 bg-[#4285F4] hover:bg-[#357AE8] rounded-lg font-semibold"
          >
            + Post a Job
          </Link>
        </div>
      )}

      {/* Jobs List */}
      <div>
        {status === "loading" && <p>Loading jobs...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && filteredJobs.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            {user?.role === "recruiter"
              ? "No jobs posted yet. Click above to create your first job!"
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

              {/* Candidate Actions */}
              {user?.role === "user" && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleApply(job._id)}
                    className="px-4 py-2 bg-[#4285F4] hover:bg-[#357AE8] rounded-lg"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleSave(job._id)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default JobPage;
