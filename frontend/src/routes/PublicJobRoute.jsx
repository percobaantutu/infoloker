import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const PublicJobRoute = ({ children }) => {
  const { user, loading } = useAuth();


  if (loading) {
    return <div>Loading...</div>;
  }

 
  if (user && user.role === "employer") {
    return <Navigate to="/employer-dashboard" replace />;
  }


  return children;
};

export default PublicJobRoute;