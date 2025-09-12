import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecruiterApplications,
  updateApplicationStatus,
} from "../../redux/JobSlice";

const RecruiterApplications = () => {
  const dispatch = useDispatch();
  const { recruiterApplications, recruiterStatus } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(fetchRecruiterApplications());
  }, [dispatch]);

  const handleStatusChange = (applicationId, status) => {
    dispatch(updateApplicationStatus({ applicationId, status }));
  };

  return (
    <div className="p-6 min-h-screen bg-[#0B1530] text-white">
      <h1 className="text-3xl font-bold mb-6">Applications for My Jobs</h1>

      {recruiterStatus === "loading" && <p>Loading...</p>}
      {recruiterStatus === "succeeded" &&
        recruiterApplications.length === 0 && (
          <p className="text-gray-400">No applications for your jobs yet.</p>
        )}

      {recruiterApplications.map((app) => {
        // ✅ safely check multiple places for user info
        const applicantName =
          app.candidate?.name || app.user?.name || app.applicant?.name || "N/A";
        const applicantEmail =
          app.candidate?.email ||
          app.user?.email ||
          app.applicant?.email ||
          "N/A";

        return (
          <div
            key={app._id}
            className="bg-black/20 p-4 rounded-lg mb-4 shadow-md"
          >
            <h2 className="text-xl font-semibold">{app.job?.title || "N/A"}</h2>
            <p>Applicant: {applicantName}</p>
            <p>Email: {applicantEmail}</p>
            <p className="mt-2">
              Status:{" "}
              <span
                className={
                  app.status === "pending"
                    ? "text-yellow-400"
                    : app.status === "accepted"
                    ? "text-green-400"
                    : app.status === "rejected"
                    ? "text-red-400"
                    : "text-gray-400"
                }
              >
                {app.status}
              </span>
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleStatusChange(app._id, "accepted")}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleStatusChange(app._id, "rejected")}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecruiterApplications;
