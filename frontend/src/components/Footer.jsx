import { Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  
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
              <p className="text-sm text-blue-100 max-w-md mx-auto">{t('footer.tagline')}</p>
            </div>

            {/* Copyright */}
            <div className="space-y-2">
              <p className="text-sm text-blue-100"><a href="https://www.instagram.com/restu__ibu">{t('footer.copyright', { year: new Date().getFullYear() })}</a></p>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

