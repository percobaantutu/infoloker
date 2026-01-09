export const BASE_URL = "http://localhost:8000"; // Ensure your backend runs on 8000

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/me", // Fixed: Backend usually uses /me, check authController
  },

  USER: {
    UPDATE_PROFILE: "/api/users/profile", // Fixed: 'users' plural
    DELETE_RESUME: "/api/users/resume", // Fixed: 'users' plural
    GET_PUBLIC_PROFILE: (id) => `/api/users/${id}`,
  },

  DASHBOARD: {
    OVERVIEW: `/api/analytics/overview`,
  },

  JOBS: {
    GET_ALL_JOBS: "/api/jobs",
    POST_JOB: "/api/jobs",
    GET_JOBS_EMPLOYER: "/api/jobs/get-jobs-employer",

    // Functions for dynamic IDs
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,

    // Saved Jobs
    SAVE_JOB: (id) => `/api/save-jobs/${id}`,
    UNSAVE_JOB: (id) => `/api/save-jobs/${id}`, // DELETE method in axios
    GET_SAVED_JOBS: "/api/save-jobs", // Fixed: Backend route is likely just /
  },

  APPLICATIONS: {
    // Fixed: Backend is POST /api/applications/:jobId
    APPLY_TO_JOB: (jobId) => `/api/applications/${jobId}`,

    // Fixed: Logic to get applicants for a job (Employer)
    GET_APPLICANTS_FOR_JOB: (jobId) => `/api/applications/job/${jobId}`,

    // Get My Applications (Job Seeker)
    GET_MY_APPLICATIONS: "/api/applications/my",

    // Update Status
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
    GET_ALL_EMPLOYER_APPLICATIONS: "/api/applications/employer/all",
  },

  IMAGE: {
    UPLOAD: "/api/auth/upload-image",
  },
};
