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
import AllApplicants from "./pages/Employer/AllApplicants";
import MyApplications from "./pages/JobSeeker/MyApplications";
import EditUserProfile from "./pages/JobSeeker/EditUserProfile";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import PublicJobRoute from "./routes/PublicJobRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import ArticleEditor from "./pages/Admin/ArticleEditor";
import ArticleManagement from "./pages/Admin/ArticleManagement";
import ArticlesPage from "./pages/Articles/ArticlesPage";
import ArticleDetailPage from "./pages/Articles/ArticleDetailPage";
import UserManagement from "./pages/Admin/UserManagement";
import JobManagement from "./pages/Admin/JobManagement";


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
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
         
        
          <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/verify-email" element={<VerifyEmail />} />

<Route 
            path="/find-jobs" 
            element={
              <PublicJobRoute>
                <JobSeekerDashboard />
              </PublicJobRoute>
            } 
          />
          <Route 
            path="/job/:jobId" 
            element={
              <PublicJobRoute>
                <JobDetails />
              </PublicJobRoute>
            } 
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/post-job" element={<JobPostingForm />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applicants" element={<AllApplicants />} />
            <Route path="/applicants/:jobId" element={<ApplicationViewer />} />
            <Route path="/company-profile" element={<EmployerProfilePage />} />
            <Route path="/company-profile/edit" element={<EditProfileDetails />} />
            <Route path="/edit-job/:jobId" element={<JobPostingForm />} />
          </Route>
           <Route element={<ProtectedRoute />}> 
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/edit" element={<EditUserProfile />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            
       
            <Route path="/applications/my" element={<MyApplications />} /> 
          </Route>
          <Route element={<ProtectedRoute requiredRole="admin" />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
   <Route path="/admin/articles" element={<ArticleManagement />} />
  <Route path="/admin/articles/new" element={<ArticleEditor />} />
<Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
<Route path="/admin/users" element={<UserManagement />} />
<Route path="/admin/jobs" element={<JobManagement />} />
</Route>

          {/* Catch All Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
