import "./index.css";
import { Button } from "@/components/ui/button";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import ManageJobs from "./pages/Employer/ManageJobs";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import EditProfileDetails from "./pages/Employer/EditProfileDetails";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/find-jobs" element={<JobSeekerDashboard />} />
          <Route path="/job/:jobId" element={<JobDetails.jsx />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/post-job" element={<JobPostingForm />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applicants/:jobId" element={<ApplicationViewer />} />
            <Route path="/company-profile" element={<EmployerProfilePage />} />
            <Route path="/company-profile/edit" element={<EditProfileDetails />} />
            <Route path="/edit-job/:jobId" element={<JobPostingForm />} />
          </Route>

          {/* Catch All Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
