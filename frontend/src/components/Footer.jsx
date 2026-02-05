import { Briefcase } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-blue-600 text-white overflow-hidden">
      <div className="relative z-10 px-6 py-16 ">
        <div className="max-w-3xl mx-auto">
          {/* Main Footer Content */}
          <div className="text-center space-y-8">
            {/* Logo/Brand */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-white">infoloker</h3>
              </div>
              <p className="text-sm text-blue-100 max-w-md mx-auto">Connecting talented professionals with innovative companies worldwide. Your career success is our mission.</p>
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <p className="text-sm text-blue-100">© {new Date().getFullYear()} Restu Muhammad.</p>
              <p className="text-xs text-blue-200">Made with ❤️ Happy Coding</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

