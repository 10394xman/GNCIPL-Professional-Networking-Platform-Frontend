import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createJob } from "../../redux/JobSlice";

const JobPostForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createJob({ title, company, location, salary, description }));
    setTitle("");
    setCompany("");
    setLocation("");
    setSalary("");
    setDescription("");
  };

  return (
    <div className="bg-black/30 p-6 rounded-xl shadow-lg mb-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 rounded bg-white text-black"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="w-full p-3 rounded bg-white text-black"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-3 rounded bg-white text-black"
        />
        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full p-3 rounded bg-white text-black"
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 rounded bg-white text-black"
          rows="3"
        />
        <button
          type="submit"
          className="w-full bg-[#4285F4] hover:bg-[#357AE8] text-white p-3 rounded-lg"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;
