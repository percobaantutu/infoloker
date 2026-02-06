import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

// SVG Flag Components for consistent rendering across all browsers
const IndonesiaFlag = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 3 2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="3" height="1" fill="#CE1126" />
    <rect y="1" width="3" height="1" fill="#FFFFFF" />
  </svg>
);

const UKFlag = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 60 30"
    xmlns="http://www.w3.org/2000/svg"
  >
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path
      d="M0,0 L60,30 M60,0 L0,30"
      clipPath="url(#t)"
      stroke="#cf142b"
      strokeWidth="4"
    />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
  </svg>
);

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "id", name: "Bahasa Indonesia", Flag: IndonesiaFlag },
    { code: "en", name: "English", Flag: UKFlag },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
      >
        <currentLanguage.Flag className="w-6 h-4 rounded-sm shadow-sm border border-gray-200" />
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage.code.toUpperCase()}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-2 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Select Language
              </p>
            </div>

            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  i18n.language === lang.code ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <lang.Flag className="w-7 h-5 rounded-sm shadow-sm border border-gray-200" />
                  <span
                    className={`font-medium ${
                      i18n.language === lang.code
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {lang.name}
                  </span>
                </div>

                {i18n.language === lang.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
