import { useNavigate } from "react-router-dom";
import { User, Mail, Edit, FileText, ExternalLink, Upload, Calendar } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useProfile } from "../../hooks/useProfile";
import moment from "moment";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useProfile();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* 1. Identity Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Cover Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="mb-2 flex items-center px-4 py-2 bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>

              {/* Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center text-gray-500 font-medium mt-1">
                  <Mail className="w-4 h-4 mr-1.5" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-400 text-sm mt-2">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Joined {moment(user.createdAt).format("MMMM YYYY")}
                </div>
              </div>
            </div>
          </div>

         
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Resume / CV
                </h2>
                {!user.resume && (
                    <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-lg">
                        Required to Apply
                    </span>
                )}
            </div>
            
            {user.resume ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-blue-100 shadow-sm">
                    <FileText className="w-6 h-6 text-red-500" /> {/* Red icon for PDF feel */}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Current Resume</p>
                    <p className="text-xs text-gray-500">PDF Document • Uploaded</p>
                  </div>
                </div>
                
                <a 
                  href={user.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </a>
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-gray-100">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No resume uploaded</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4 max-w-xs mx-auto">
                    Upload your CV to start applying for jobs. Employers cannot see your application without it.
                </p>
                <button 
                    onClick={() => navigate("/profile/edit")}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Upload Resume
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;