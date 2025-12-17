import React from "react";
import { Briefcase } from "lucide-react";

const LoadingSpinner = () => {
  return (
    // Container: Full screen height with a gradient background
    // Added 'flex items-center justify-center' to center the spinner on screen
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner Container */}
        <div className="relative">
          {/* The Spinning Ring */}
          {/* Reconstructed: Added height/width and border colors */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>

          {/* The Static Icon in the Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Loading Text */}
        <p className=" text-gray-600 font-medium">Finding amazing opportunities...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
