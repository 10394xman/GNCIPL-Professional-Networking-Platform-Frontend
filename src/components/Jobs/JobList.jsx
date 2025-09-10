import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../redux/JobSlice";
import JobCard from "./JobCard";

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  if (status === "loading") return <p className="text-white">Loading jobs...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Available Jobs</h2>
      {Array.isArray(jobs) && jobs.length > 0 ? (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      ) : (
        <p className="text-gray-400">No jobs available</p>
      )}
    </div>
  );
};

export default JobList;
