import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="bg-black/20 p-4 rounded-xl shadow-md mb-4 border border-gray-700">
      <h3 className="text-xl font-semibold text-white">{job.title}</h3>
      <p className="text-gray-400">{job.company}</p>
      <p className="text-gray-400 text-sm">{job.location}</p>
      <p className="text-gray-300 mt-2">{job.description}</p>
      <div className="flex justify-between mt-3 text-sm text-gray-400">
        <span>💰 {job.salary || "N/A"}</span>
        <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default JobCard;
