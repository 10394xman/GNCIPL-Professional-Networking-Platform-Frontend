// src/components/pages/MyApplications.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyApplications } from "../../redux/JobSlice";

const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen bg-[#0B1530] text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">My Applications</h1>

      {/* Loading State */}
      {status === "loading" && (
        <p className="text-center text-gray-400">Loading applications...</p>
      )}

      {/* Error State */}
      {status === "failed" && (
        <p className="text-center text-red-500">
          Failed to load applications: {error}
        </p>
      )}

      {/* Empty State */}
      {status === "succeeded" && applications.length === 0 && (
        <p className="text-center text-gray-400">
          You haven’t applied to any jobs yet.
        </p>
      )}

      {/* Applications List */}
      {status === "succeeded" &&
        applications.map((app) => (
          <div
            key={app._id}
            className="bg-black/20 p-4 rounded-lg mb-4 shadow-md"
          >
            <h2 className="text-xl font-semibold">{app.job?.title}</h2>
            <p className="text-gray-400">{app.job?.company}</p>
            <p className="text-gray-400">{app.job?.location}</p>

            <p className="mt-2">
              Status:{" "}
              <span
                className={
                  app.status === "Pending"
                    ? "text-yellow-400 font-medium"
                    : app.status === "Shortlisted"
                    ? "text-green-400 font-medium"
                    : "text-red-400 font-medium"
                }
              >
                {app.status}
              </span>
            </p>
          </div>
        ))}
    </div>
  );
};

export default MyApplications;


